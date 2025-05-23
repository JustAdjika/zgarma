import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios'

import BUG_FIXES_TAB from '../database/bugFixes.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'
import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'

const router = express.Router();
router.use(bodyParser.json());

const botKey = process.env.BOT_ACCESS_KEY

console.log(`\x1b[34m |!|   BUG_FIX ROUTER READY   |!|\x1b[0m`);

// GET ALL PATCH NOTES
router.get('/data/all', async(req,res) => {
    try{
        const container = await BUG_FIXES_TAB.findAll()

        if(!container){
            console.log(`[${GetDateInfo().all}] API выдан список патч ноутов`)

            res.json({
                status: 200,
                container: []
            })
            return
        }

        console.log(`[${GetDateInfo().all}] API выдан список патч ноутов`)

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bugfix/notes/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/notes/data/all - ${e}`
        });
    };
});

// ADD NEW PATCH NOTE
router.post('/add', AccountCheck, PermissionsCheck, async(req,res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API добавление патч ноута прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const container = await BUG_FIXES_TAB.create({
            title: data.title,
            content: data.content,
            date: GetDateInfo().date,
            devBranch: data.devBranch
        })

        const botData = {
            title: data.title,
            content: data.content,
            date: GetDateInfo().date,
            id: container.id,
            botKey: botKey,
            devBranch: data.devBranch
        }

        console.log(`[${GetDateInfo().all}] API патч ноут ${container.id} успешно добавлен администратором ${user.id}`)

        axios.post('http://localhost:3000/api/developer/bot/patchnote', botData)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bugfix/notes/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/notes/add - ${e}`
        });
    };
});

export default router;