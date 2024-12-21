import express from 'express';
import bodyParser from 'body-parser';

import BUG_FIXES_TAB from '../database/bugFixes.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|   BUG_FIX ROUTER READY   |!|\x1b[0m`);

// GET ALL PATCH NOTES
router.get('/data/all', async(req,res) => {
    try{
        const container = await BUG_FIXES_TAB.findAll()

        if(!container){
            res.json({
                status: 200,
                container: []
            })
            return
        }

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: bugfix/notes/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/notes/data/all - ${e}`
        });
    };
});

// ADD NEW PATCH NOTE
router.post('/add', async(req,res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const container = await BUG_FIXES_TAB.create({
            title: data.title,
            content: data.content,
            date: GetDateInfo.date
        })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: bugfix/notes/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/notes/add - ${e}`
        });
    };
});

export default router;