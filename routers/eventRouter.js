import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'
import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'

const router = express.Router();
router.use(bodyParser.json());

const host = process.env.BASIC_URL
const botKey = process.env.BOT_ACCESS_KEY

router.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' blob:; worker-src 'self' blob:;");
    next();
});

console.log(`\x1b[34m |!|    EVENT ROUTER READY    |!|\x1b[0m`);


// ADD NEW EVENT
router.post('/add', AccountCheck, PermissionsCheck, async(req, res) => {
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

        if(data.title == '') {
            res.json({
                status: 400,
                err: 'The title is incorrectly filled'
            })
            return
        }

        if(data.date == '..') {
            res.json({
                status: 400,
                err: 'The date is incorrectly filled'
            })
            return
        }

        const newEvent = EVENTS_TAB.create({
            status: 'READY',
            type: data.type,
            date: data.date,
            time: null,
            title: data.title,
            metar: data.metar,
            description: data.description,
            team1: data.team1,
            team2: data.team2,
            imgPath: null,
            slotsTeam1: [{
                title: "Командир Стороны",
                player: null
            }],
            slotsTeam2: [{
                title: "Командир Стороны",
                player: null
            }],
            vehTeam1: [],
            vehTeam2: [],
            devBranch: data.devBranch
        })

        axios.post(`${host}/api/developer/bot/eventAnnouncements/ready`, {
            eventDate: data.date,
            eventTeam1: data.team1,
            eventTeam2: data.team2,
            eventType: data.type,
            eventTitle: data.title,
            botKey: botKey,
            devBranch: data.devBranch
        })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/add - ${e}`
        });
    };
})


// GET ALL EVENTS
router.get('/data/all', async(req, res) => {
    try{
        const container = await EVENTS_TAB.findAll()

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
        console.error(`\x1b[31mApi developer error: event/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/add - ${e}`
        });
    };
})


// Скачивание модпака с сервера
router.get('/data/download/modpack/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: eventId
            }
        })

        if(!currentEvent){
            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        const filePath = currentEvent.dataValues.modsPath
        res.download(filePath, (err) => {
            if (err) {
                console.error("Ошибка при скачивании:", err);
                res.status(500).send("Ошибка при скачивании файла.");
            }
        });
    } catch(e) {
        console.error(`\x1b[31mApi developer error: /data/download/modpack/ - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: /data/download/modpack/ - ${e}`
        });
    }
})

export default router;