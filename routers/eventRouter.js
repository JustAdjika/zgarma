import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'
import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'
import EVENT_REQUESTS_TAB from '../database/eventRequests.js';

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
            console.log(`[${GetDateInfo().all}] API создание события прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        if(data.title == '') {
            console.log(`[${GetDateInfo().all}] API создание события прервано. Заголовок пуст`)

            res.json({
                status: 400,
                err: 'The title is incorrectly filled'
            })
            return
        }

        if(data.date == '..') {
            console.log(`[${GetDateInfo().all}] API создание события прервано. Дата указана некорректно`)
            
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
            devBranch: data.devBranch,
            eventid: newEvent.id
        })

        console.log(`[${GetDateInfo().all}] API событие ${newEvent.id} успешно создано администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/add - ${e} \x1b[31m`);
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
            console.log(`[${GetDateInfo().all}] API выдан список ивентов`)

            res.json({
                status: 200,
                container: []
            })
            return
        }

        console.log(`[${GetDateInfo().all}] API выдан список ивентов`)

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/add - ${e} \x1b[31m`);
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
            console.log(`[${GetDateInfo().all}] API выдача модпака прервана. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        console.log(`[${GetDateInfo().all}] API выдан модпак события ${currentEvent.id}`)

        const filePath = currentEvent.dataValues.modsPath
        res.download(filePath, (err) => {
            if (err) {
                console.error("Ошибка при скачивании:", err);
                res.status(500).send("Ошибка при скачивании файла.");
            }
        });
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: /data/download/modpack/ - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: /data/download/modpack/ - ${e}`
        });
    }
})


// FORCE SLOT PLAYER SET
router.post('/playerset', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        if ([data.userId, data.eventId, data.team, data.squad, data.slot, data.key].some(v => v === null)) {
            console.log(`[${GetDateInfo().all}] API назначение игрока на слот прервано. Параметр не указан`)

            res.json({
                status: 404,
                err: 'One of the params is not specified'
            })
            return
        }

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API назначение игрока на слот прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const event = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        const oldRequests = await EVENT_REQUESTS_TAB.findAll({
            where: {
                eventId: data.eventId,
                userId: data.userId,
            }
        })

        for (const oldRequest of oldRequests) {
            await oldRequest.destroy();
        }


        // Убрать пользователя с зарегестрированной позиции, если она есть
        event.slotsTeam1.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === data.userId) {
                    event.slotsTeam1[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === data.userId) {
                        event.slotsTeam1[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        event.slotsTeam2.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === data.userId) {
                    event.slotsTeam2[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === data.userId) {
                        event.slotsTeam2[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });


        let slots = data.team == 'Red'
            ? event.dataValues.slotsTeam1
            : event.dataValues.slotsTeam2


        const newRequest = await EVENT_REQUESTS_TAB.create({
            userId: data.userId,
            eventId: data.eventId,
            team: data.team,
            squad: data.squad,
            slot: data.slot,
            maybeSL: false,
            maybeTL: false,
            date: GetDateInfo().all,
            status: false
        })

        if(data.squad === 0) {
            slots[data.squad].player = data.userId

            let HQsquadIndex = null

            slots.forEach((item, index) => {
                if(slots[index].hq) {
                    slots[index].slots[0].player = data.userId
                    HQsquadIndex = index
                }
            })

            if(HQsquadIndex) {
                await EVENT_REQUESTS_TAB.create({
                    userId: data.userId,
                    eventId: data.eventId,
                    team: data.team,
                    squad: HQsquadIndex,
                    slot: 0,
                    maybeSL: false,
                    maybeTL: false,
                    date: GetDateInfo().all,
                    status: false
                })
            }
        } else {
            slots[data.squad].slots[data.slot].player = data.userId

            if(data.slot === 0 && data.squad !== 0 && slots[data.squad].hq) {
                slots[0].player = data.userId

                await EVENT_REQUESTS_TAB.create({
                    userId: data.userId,
                    eventId: data.eventId,
                    team: data.team,
                    squad: 0,
                    slot: 0,
                    maybeSL: false,
                    maybeTL: false,
                    date: GetDateInfo().all,
                    status: false
                })
            }
        }


        if(data.team === 'Red') {
            event.setDataValue('slotsTeam1', slots)
        } else {
            event.setDataValue('slotsTeam2', slots)
        }

        event.changed('slotsTeam1', true);
        event.changed('slotsTeam2', true);
        await event.save();

        console.log(`[${GetDateInfo().all}] API пользователь ${data.userId} принудительно помещен в слот: ${data.team}; ${data.squad}; ${data.slot || 0}; в событии ${data.eventId} администратором ${user.id}`)

        res.json({
            status: 200
        })

    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/playerset - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/playerset - ${e}`
        });
    };
})

export default router;