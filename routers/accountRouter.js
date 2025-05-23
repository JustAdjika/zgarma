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
import NOTICES_TAB from '../database/notices.js'

import GetDateInfo from '../modules/dateInfo.js';
import AccountCheck from '../modules/accountCheck.js'
import PermissionsCheck from '../modules/permissions.js'

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
        try {
            const userData = req.user._json

            const foundAccount = await ACCOUNTS_TAB.findOne({
                where: {
                    key: JSON.parse(req.cookies.userData).key
                }
            })

            if(!foundAccount) {
                console.log(`[${GetDateInfo().all}] AUTH PROCESS: Steam Callback. Процесс прерван. Аккаунт не найден`)
                return res.end("Ошибка аутентификации")
            }

            await foundAccount.update({
                steam: userData
            })

            let parsedData = foundAccount.dataValues

            res.cookie("userData", JSON.stringify(parsedData), {
                secure: true, // Должно быть true, если используешь HTTPS
                sameSite: "None", // Разрешает передачу куков между разными доменами
                domain: ".zgarma.ru",
                maxAge: 60 * 24 * 60 * 60 * 1000, 
            });

            console.log(`[${GetDateInfo().all}] AUTH PROCESS: Steam Callback. Steam успешно привязан`)

            res.redirect("https://zgarma.ru/announcement")
        } catch (e) {
            console.error(`\x1b[31mApi developer error: Steam callback error - ${e} \x1b[0m`);
        }
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
            console.log(`[${GetDateInfo().all}] API выдача аккаунта по ID прервано. Аккаунт не найден`)

            res.json({
                status: 404,
                err: 'Api developer error: account/data/id - user undefined'
            });
        }else{
            console.log(`[${GetDateInfo().all}] API пользователь ${req.query.id} выдан по ID`)

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
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/data/id - ${e} \x1b[0m`);
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
            console.log(`[${GetDateInfo().all}] API выдача аккаунта пользователя по KEY прервана. Аккаунт не найден`)

            res.json({
                status: 404,
                err: 'Api developer error: account/data/key - user undefined'
            });
        }else{
            console.log(`[${GetDateInfo().all}] API пользователь ${account.id} выдан по KEY`)

            res.json({
                status: 200,
                container: account
            });
        };
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/data/key - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/data/key - ${e}`
        });
    };
});


// DISCORD CALLBACK
router.get('/data/discord', async(req,res) => {
    const code = req.query.code

    if(!code) {
        console.log(`[${GetDateInfo().all}] AUTH PROCESS: Discord Callback. Процесс прерван, auth code не найден`)

        return res.json({
            status: 400,
            err: 'Discord auth code undefined'
        })
    }

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
                date: GetDateInfo().all
            })

            axios.post(`${host}/api/developer/bot/role/add/authorized`, {
                botKey: botKey,
                discordid: userResponse.data.id
            })

            res.cookie("userData", JSON.stringify(newUser), {
                secure: true, // Должно быть true, если используешь HTTPS
                sameSite: "None", // Разрешает передачу куков между разными доменами
                domain: ".zgarma.ru",
                maxAge: 60 * 24 * 60 * 60 * 1000, 
            });

            console.log(`[${GetDateInfo().all}] AUTH PROCESS: Discord Callback. Новый пользователь зарегистрирован`)

            res.json({
                status: 200,
                container: newUser
            })
        }else{
            let parsedData = foundUser.dataValues
            parsedData.steam = parsedData.steam

            axios.post(`${host}/api/developer/bot/role/add/authorized`, {
                botKey: botKey,
                discordid: parsedData.discord.id
            })

            res.cookie("userData", JSON.stringify(parsedData), {
                secure: true, // Должно быть true, если используешь HTTPS
                sameSite: "None", // Разрешает передачу куков между разными доменами
                domain: ".zgarma.ru",
                maxAge: 60 * 24 * 60 * 60 * 1000, 
            });

            console.log(`[${GetDateInfo().all}] AUTH PROCESS: Discord Callback. Вход в аккаунт произведен`)

            res.json({
                status: 200,
                container: parsedData
            })
        }
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/data/discord - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/data/discord - ${e}`
        });
    }
});


// GET NOTICES
router.post('/notices/data/all', AccountCheck, async(req, res) => {
    try{
        const data = req.body

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAccount) {
            console.log(`[${GetDateInfo().all}] API получение уведомлений пользователя прервано. Пользователь не найден`)
            return res.json({ status: 404, err: 'Account undefined' })
        }

        const notices = await NOTICES_TAB.findAll({
            where: {
                destination: foundAccount.id
            }
        })

        console.log(`[${GetDateInfo().all}] API выдан список уведомлений пользователя ${foundAccount.id}`)

        res.json({
            status: 200,
            container: notices
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/notices/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/notices/data/all - ${e}`
        });
    };
})



// SET READ STATUS
router.patch('/notices/setRead', AccountCheck, async(req, res) => {
    try{
        const data = req.body

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAccount) {
            console.log(`[${GetDateInfo().all}] API процесс смены статуса оповещения прерван. Пользователь не найден`)
            return res.json({ status: 404, err: 'Account undefined' })
        }

        const foundNotice = await NOTICES_TAB.findOne({
            where: {
                id: data.noticeid
            }
        })

        if(!foundNotice) {
            console.log(`[${GetDateInfo().all}] API процесс смены статуса оповещения прерван. Оповещение не найдено`)
            return res.json({ status: 404, err: 'Notice undefined' })
        }

        if(foundAccount.id != foundNotice.destination) {
            console.log(foundAccount.id)
            console.log(foundNotice.destination)
            console.log(`[${GetDateInfo().all}] API процесс смены статуса оповещения прерван. Пользователь не получатель указанного оповещения`)
            return res.json({ status: 403, err: 'Not allowed' })
        }

        await foundNotice.update({
            isRead: true
        })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/notices/setRead - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/notices/setRead - ${e}`
        });
    };
})



router.get('/logout', async (req, res) => {
    try {
        res.clearCookie("userData", {
            domain: ".zgarma.ru",
            secure: true, // Должно быть true, если используешь HTTPS
            sameSite: "None"
        });

        console.log(`[${GetDateInfo().all}] API пользователь вышел из аккаунта`)

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/logout - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/logout - ${e}`
        });
    }
})


router.post('/notices/add', AccountCheck, PermissionsCheck, async (req, res) => {
    try {
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API отправка уведомления пользователю прервана. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const foundDestination = await ACCOUNTS_TAB.findOne({
            where: {
                id: data.dest
            }
        })

        if(!foundDestination) {
            console.log(`[${GetDateInfo().all}] API отправка уведомления пользователю прервана. Получатель не найден`)

            res.json({
                status: 404,
                err: 'Destionation undefined'
            })
            return
        }

        const newNotice = await NOTICES_TAB.create({
            destination: foundDestination.id,
            content: data.content,
            date: GetDateInfo().all
        })

        axios.post(`${host}/api/developer/bot/notice/send`, {
            discordid: foundDestination.discord.id,
            noticeid: newNotice.id,
            content: newNotice.content,
            botKey: botKey
        })

        console.log(`[${GetDateInfo().all}] API уведомление ${newNotice.id} успешно отправлено для пользователя ${foundDestination.id} администратором ${user.id}`)

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: account/notices/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: account/notices/add - ${e}`
        });
    }
})

export default router;