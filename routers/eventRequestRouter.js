import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';
import EVENT_REQUESTS_TAB from '../database/eventRequests.js';
import NOTICES_TAB from '../database/notices.js'

import GetDateInfo from '../modules/dateInfo.js'
import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'
import SteamCheck from '../modules/steamCheck.js'

const router = express.Router();
router.use(bodyParser.json());

const host = process.env.BASIC_URL
const botKey = process.env.BOT_ACCESS_KEY

console.log(`\x1b[34m |!|   EVENT_R ROUTER READY   |!|\x1b[0m`);


// GET ALL REQUESTS
router.post('/data/all', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API получение всех заявок прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        let container = await EVENT_REQUESTS_TAB.findAll()

        if(!container) {
            container = []
        }

        console.log(`[${GetDateInfo().all}] API выдан список всех заявок для администратора ${user.id}`)

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/request/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/data/all - ${e}`
        });
    };
})



// GET REQUESTS BY EVENT ID
router.post('/data/id', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API получение заявок события по ID прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        let container = await EVENT_REQUESTS_TAB.findAll({
            where: {
                eventId: data.id
            }
        })

        if(!container) {
            container = []
        }

        console.log(`[${GetDateInfo().all}] API выдан список всех заявок на событие ${data.id} для администратора ${user.id}`)

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/request/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/data/all - ${e}`
        });
    };
})


router.get('/data/accepted/id', async(req, res) => {
    try{
        let container = await EVENT_REQUESTS_TAB.findAll({
            where: {
                eventId: req.query.id,
                status: false
            }
        })

        if(!container) {
            container = []
        }

        console.log(`[${GetDateInfo().all}] API выдан список всех принятых заявок на событие ${req.query.id}`)

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/request/data/accepted/id - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/data/accepted/id - ${e}`
        });
    };
})



// ADD NEW REQUEST
router.post('/add', SteamCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const foundEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!foundEvent) {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Event undefined'
            })
            return
        }

        if(foundEvent.status === 'CONTINUE') {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Событие закрыло регистрацию`)

            res.json({
                status: 403,
                err: 'Event registration was closed by administrator'
            })
            return
        }

        if( !data.team || data.squad === null || data.slot === null || data.maybeSL === null || data.maybeTL === null ) {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Не все данные указаны`)

            res.json({
                status: 400,
                err: 'One of the parameters is not specified'
            })
            return
        }

        const slots = data.team === 'Red'
            ? foundEvent.dataValues.slotsTeam1
            : data.team === 'Blue'
            ? foundEvent.dataValues.slotsTeam2
            : "Undefined"

        if(slots === 'Undefined') {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Команда указана неверно`)

            res.json({
                status: 400,
                err: 'The team can only be Blue and Red'
            })
            return
        }

        const squad = slots[data.squad]
        let slot

        if(data.squad === 0) {
            slot = squad
        }else{
            if(!squad) {
                console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Отряд не найден`)
                return res.json({status: 404, err: 'This squad is undefined'})
            }

            slot = squad.slots[data.slot]
        }

        if(!slot) {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Слот не найден`)

            res.json({
                status: 404,
                err: 'This slot is undefined',
            })
            return
        }

        if(slot.player != null) {
            console.log(`[${GetDateInfo().all}] API добавление заявки на событие прервано. Слот занят другим пользователем`)

            res.json({
                status: 400,
                err: 'This slot is now busy with another player'
            })
            return
        }

        const userRegisterList = await EVENT_REQUESTS_TAB.findOne({
            where: {
                userId: user.id,
                eventId: foundEvent.id
            }
        })

        if(userRegisterList) {
            await userRegisterList.destroy()
        }

        const newRequest = await EVENT_REQUESTS_TAB.create({
            userId: user.id,
            eventId: foundEvent.id,
            team: data.team,
            squad: data.squad,
            slot: data.slot,
            maybeSL: data.maybeSL,
            maybeTL: data.maybeTL,
            date: GetDateInfo().all
        })

        console.log(`[${GetDateInfo().all}] API заявка на событие ${foundEvent.id} успешно отправлена игроком ${user.id} под ID ${newRequest.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/request/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/add - ${e}`
        });
    };
})



// ACCEPT REQUEST
router.post('/accept', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] TEST API принятие заявки прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const foundRequest = await EVENT_REQUESTS_TAB.findOne({
            where: {
                id: data.requestId
            }
        })

        if(!foundRequest) {
            console.log(`[${GetDateInfo().all}] TEST API принятие заявки прервано. Заявка не найдена`)

            res.json({
                status: 404,
                err: 'Request undefined'
            })
            return
        }

        const foundDestination = await ACCOUNTS_TAB.findOne({
            where: {
                id: data.dest
            }
        })

        if(!foundDestination) {
            console.log(`[${GetDateInfo().all}] TEST API принятие заявки прервано. Отправить заявки не найден`)

            res.json({
                status: 404,
                err: 'Destionation undefined'
            })
            return
        }

        const event = await EVENTS_TAB.findOne({
            where: {
                id: foundRequest.eventId
            }
        })


        // Убрать пользователя с зарегестрированной позиции, если она есть
        event.slotsTeam1.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === foundRequest.userId) {
                    event.slotsTeam1[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === foundRequest.userId) {
                        event.slotsTeam1[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        event.slotsTeam2.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === foundRequest.userId) {
                    event.slotsTeam2[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === foundRequest.userId) {
                        event.slotsTeam2[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        let slots = foundRequest.team == 'Red'
            ? event.dataValues.slotsTeam1
            : event.dataValues.slotsTeam2


        if(foundRequest.squad === 0) {
            slots[foundRequest.squad].player = foundRequest.userId
        } else {
            slots[foundRequest.squad].slots[foundRequest.slot].player = foundRequest.userId
        }


        if(foundRequest.team === 'Red') {
            event.setDataValue('slotsTeam1', slots)
        } else {
            event.setDataValue('slotsTeam2', slots)
        }

        event.changed('slotsTeam1', true);
        event.changed('slotsTeam2', true);
        await event.save();


        const newNotice = await NOTICES_TAB.create({
            destination: foundDestination.id,
            content: `Ваша заявка в регистрации на роль "${data.eventSlot}" в игре "${data.eventTitle}" была одобрена`,
            date: GetDateInfo().all
        })

        axios.post(`${host}/api/developer/bot/notice/send`, {
            discordid: user.discord.id,
            noticeid: newNotice.id,
            content: newNotice.content,
            botKey: botKey
        })

        await foundRequest.update({status: false})

        console.log(`[${GetDateInfo().all}] TEST API заявка ${foundRequest.id} от игрока ${foundRequest.userId} на игру ${foundRequest.eventId} принята администратором ${user.id}`)

        res.json({
            status: 200
        })

    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] TEST Api developer error: event/request/accept - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/accept - ${e}`
        });
    };
})



// CANCEL REQUEST
router.post('/cancel', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] TEST API отклонение заявки прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const foundRequest = await EVENT_REQUESTS_TAB.findOne({
            where: {
                id: data.requestId
            }
        })

        if(!foundRequest) {
            console.log(`[${GetDateInfo().all}] TEST API отклонение заявки прервано. Заявка не найдена`)

            res.json({
                status: 404,
                err: 'Request undefined'
            })
            return
        }

        const foundDestination = await ACCOUNTS_TAB.findOne({
            where: {
                id: data.dest
            }
        })

        if(!foundDestination) {
            console.log(`[${GetDateInfo().all}] TEST API отклонение заявки прервано. Отправитель заявки не найден`)

            res.json({
                status: 404,
                err: 'Destionation undefined'
            })
            return
        }



        const newNotice = await NOTICES_TAB.create({
            destination: foundDestination.id,
            content: `Ваша заявка в регистрации на игру была отклонена управляющим составом, по причине: ${data.reason}`,
            date: GetDateInfo().all
        })

        axios.post(`${host}/api/developer/bot/notice/send`, {
            discordid: user.discord.id,
            noticeid: newNotice.id,
            content: newNotice.content,
            botKey: botKey
        })

        await foundRequest.update({status: false})

        console.log(`[${GetDateInfo().all}] TEST API заявка ${foundRequest.id} на игру ${foundRequest.eventId} от пользователя ${foundRequest.userId} отклонена администратором ${user.id}`)

        res.json({
            status: 200
        })

    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] TEST Api developer error: event/request/cancel - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/cancel - ${e}`
        });
    };
})


export default router;