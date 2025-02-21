import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import axios from 'axios';
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize';

import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'

const router = express.Router();
router.use(bodyParser.json());
dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

console.log(`\x1b[34m |!|   ACCOUNT ROUTER READY   |!|\x1b[0m`);

// TEST ADD
router.post('/testAdd', async(req, res) => {
    const data = req.body;

    const newField = await ACCOUNTS_TAB.create({
        key: 'myKey',
        steam: {
            nickname: `${data.steam}'s steam`,
            steamid: `${data.steam}'s steamid`
        },
        discord: {
            nickname: `${data.discord}'s discord`,
            steamid: `${data.discord}'s discordid`
        },
        date: GetDateInfo.date
    });

    res.end('Req end');
});

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
            res.json({
                status: 200,
                container: newUser
            })
        }else{
            res.json({
                status: 200,
                container: foundUser
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