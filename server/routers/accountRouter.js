import express from 'express';
import bodyParser from 'body-parser';

import ACCOUNTS_TAB from '../database/accounts.js';

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!| ACCOUNT ROUTER READY |!|\x1b[0m`);

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
        date: 'today'
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

export default router;