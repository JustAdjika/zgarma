import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import axios from 'axios';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import passport from 'passport';
import session from 'express-session';
import { Strategy as SteamStrategy } from 'passport-steam';
import cookieParser from 'cookie-parser';

import { Sequelize } from 'sequelize';

import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js';

const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser())
dotenv.config()


const botKey = process.env.BOT_ACCESS_KEY
const host = process.env.BASIC_URL

// GENERAL DOTENV
const BASIC_URL = process.env.BASIC_URL
const SESSION_SECRET = process.env.SESSION_SECRET

// DISCORD DOTENV
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// STEAM DOTENV
const STEAM_API_KEY = process.env.STEAM_API_KEY



// STEAM AUTH 

router.use(
    session({
        secret: SESSION_SECRET, // Замени на случайную строку
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Используй true, если у тебя HTTPS
    })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
    new SteamStrategy(
        {
            returnURL: `${BASIC_URL}/api/developer/account/auth/steam/callback`,
            realm: BASIC_URL,
            apiKey: STEAM_API_KEY
        },
        (identifier, profile, done) => {  // <-- добавил колбэк
            return done(null, profile);
        }
    )
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


router.get("/auth/steam", passport.authenticate("steam"));

router.get(
    "/auth/steam/callback", 
    passport.authenticate("steam", { failureRedirect: "/announcement" }),
    async(req, res) => {
        const userData = req.user._json

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: JSON.parse(req.cookies.userData).key
            }
        })

        if(!foundAccount) {
            return res.end("Ошибка аутентификации")
        }

        await foundAccount.update({
            steam: userData
        })

        let parsedData = foundAccount.dataValues
        parsedData.discord = JSON.parse(parsedData.discord)

        res.cookie("userData", JSON.stringify(parsedData), {
            httpOnly: false, // Куки доступны только серверу (защита от XSS)
            secure: false, // Установи `true`, если используешь HTTPS
            maxAge: 60 * 24 * 60 * 60 * 1000, // 60 дней
        });

        res.redirect("http://localhost:5173/announcement")
    }
)


console.log(`\x1b[34m |!|   ACCOUNT ROUTER READY   |!|\x1b[0m`);

// GET USER BY ID
router.get('/data/id', async(req,res) => {
    try{
        const id = req.query.id;

        const account = await ACCOUNTS_TAB.findOne({
            where: { id }
        });

        if(!account){ 
            res.json({
                status: 404,
                err: 'Api developer error: account/data/id - user undefined'
            });
        }else{
            res.json({
                status: 200,
                container: {
                    steam: account.steam,
                    discord: account.discord,
                    date: account.date
                }
            });
        };
    }catch(e){
        console.error(`\x1b[31mApi developer error: account/data/id - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: account/data/id - ${e}`
        });
    };
});

// GET USER BY KEY
router.get('/data/key', async(req,res) => {
    try{
        const key = req.query.key;

        const account = await ACCOUNTS_TAB.findOne({
            where: { key: key }
        });

        if(!account){ 
            res.json({
                status: 404,
                err: 'Api developer error: account/data/key - user undefined'
            });
        }else{
            res.json({
                status: 200,
                container: account
            });
        };
    }catch(e){
        console.error(`\x1b[31mApi developer error: account/data/key - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/data/key - ${e}`
        });
    };
});


// DISCORD CALLBACK
router.get('/data/discord', async(req,res) => {
    const code = req.query.code

    if(!code) return res.json({
        status: 400,
        err: 'Discord auth code undefined'
    })

    try {
        const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });


        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const foundUser = await ACCOUNTS_TAB.findOne({
            where: Sequelize.where(
                Sequelize.json("discord.id"),
                userResponse.data.id
            )
        })

        if(!foundUser) {
            const newKey = crypto.randomBytes(32).toString('hex')
            const hashedKey = await bcrypt.hash( newKey, 10 )
            const newUser = await ACCOUNTS_TAB.create({
                key: hashedKey,
                steam: null,
                discord: userResponse.data,
                date: GetDateInfo.all
            })

            axios.post(`${host}/api/developer/bot/role/add/authorized`, {
                botKey: botKey,
                discordid: userResponse.data.id
            })

            res.json({
                status: 200,
                container: newUser
            })
        }else{
            let parsedData = foundUser.dataValues
            parsedData.discord = JSON.parse(parsedData.discord)

            axios.post(`${host}/api/developer/bot/role/add/authorized`, {
                botKey: botKey,
                discordid: parsedData.discord.id
            })

            res.json({
                status: 200,
                container: parsedData
            })
        }
    } catch (e) {
        console.error(`\x1b[31mApi developer error: account/data/discord - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/data/discord - ${e}`
        });
    }
});





export default router;