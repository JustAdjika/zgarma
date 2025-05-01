import express from 'express';
import bodyParser from 'body-parser';

import ACCOUNTS_TAB from '../database/accounts.js';
import EVENTS_TAB from '../database/events.js';

import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'
import GetDateInfo from '../modules/dateInfo.js';

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|   EVENT_S ROUTER READY   |!|\x1b[0m`);


// ADD NEW SQUAD
router.post('/add', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API добавление отряда прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API добавление отряда прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        const newSquad = {
            title: "Squad",
            slots: [
                {
                    title: "Squad Leader",
                    player: null,
                    SL: true
                }
            ] 
        }

        let oldSquadList

        if(data.team == 'Red') { oldSquadList = currentEvent.dataValues.slotsTeam1 }
        else if(data.team == 'Blue') { oldSquadList = currentEvent.dataValues.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API добавление отряда прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        const updateSquadList = [...oldSquadList, newSquad]

        if(data.team == 'Red') { await currentEvent.update({slotsTeam1: updateSquadList}) }
        else if(data.team == 'Blue') { await currentEvent.update({slotsTeam2: updateSquadList}) }
        else {
            console.log(`[${GetDateInfo().all}] API добавление отряда прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command (2lvl)'
            })
            return
        }

        console.log(`[${GetDateInfo().all}] API слот отряда успешно добавлен в событие ${currentEvent.id} команды ${data.team} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/add - ${e}`
        });
    };
})




// DELETE SQUAD
router.delete('/delete', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API удаление отряда прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API удаление отряда прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        let squadList
        const squadId = data.squadId

        if(data.team == 'Red') { squadList = currentEvent.slotsTeam1 }
        else if(data.team == 'Blue') { squadList = currentEvent.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API удаление отряда прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            console.log(`[${GetDateInfo().all}] API удаление отряда прервано. Отряд не найден`)

            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) {
            console.log(`[${GetDateInfo().all}] API удаление отряда прервано. Попытка удалить отряд 0`)
            return res.json({ status: 400, err: 'You can\'t delete squad with id 0' })
        }

        squadList.splice(squadId, 1)

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        console.log(`[${GetDateInfo().all}] API слот отряда в событии ${currentEvent.id} команды ${data.team} успешно удален администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/delete - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/delete - ${e}`
        });
    };
})





// ADD NEW SLOT TO SQUAD
router.post('/slots/add', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API Добавление слота прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API Добавление слота прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        const squadId = data.squadId
        const newSlot = {
            title: "Riffleman",
            player: null,
            SL: false
        }

        let oldSquadList

        if(data.team == 'Red') { oldSquadList = currentEvent.dataValues.slotsTeam1 }
        else if(data.team == 'Blue') { oldSquadList = currentEvent.dataValues.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API Добавление слота прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        let squadListParsed = oldSquadList
        const foundSquad = squadListParsed[squadId]

        if(!foundSquad) {
            console.log(`[${GetDateInfo().all}] API Добавление слота прервано. Отряд не найден`)

            res.json({
                status: 404,
                err: 'Squad by id is undefined'
            })
            return
        }

        if(squadId == 0) {
            console.log(`[${GetDateInfo().all}] API Добавление слота прервано. Попытка добавления слота в отряд 0`)
            return res.json({status: 400, err: 'You can\'t add new slot to squad with id 0'})
        }

        const oldSlots = squadListParsed[squadId].slots
        squadListParsed[squadId].slots = [...oldSlots, newSlot]



        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadListParsed) }
        else { currentEvent.setDataValue('slotsTeam2', squadListParsed) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        console.log(`[${GetDateInfo().all}] API слот успешно добавлен в отряд ${squadId} команды ${data.team} события ${currentEvent.id} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/slots/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/add - ${e}`
        });
    };
})




// DELETE KIT SLOT
router.delete('/slots/delete', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        let squadList
        const squadId = data.squadId
        const slotId = data.slotId

        if(data.team == 'Red') { squadList = currentEvent.slotsTeam1 }
        else if(data.team == 'Blue') { squadList = currentEvent.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }



        if(!squadList[squadId]){
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Отряд не найден`)

            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) {
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Попытка удалить слот отряда 0)`)
            return res.json({ status: 400, err: 'You can\'t delete slots from squad with id 0' })
        }

        if(!squadList[squadId].slots[slotId]) {
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Слот не найден`)

            res.json({
                status: 404,
                err: 'Slot by id undefined'
            })
            return
        }

        if(slotId == 0) {
            console.log(`[${GetDateInfo().all}] API удаление слота прервано. Попытка удалить слот 0`)
            return res.json({ status: 400, err: 'You can\'t delete slot with id 0' })
        }

        squadList[squadId].slots.splice(slotId, 1)

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        console.log(`[${GetDateInfo().all}] API слот успешно удален из отряда ${squadId} команды ${data.team} события ${currentEvent.id} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/slots/delete - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/delete - ${e}`
        });
    };
})




// CHANGE SQUAD NAME
router.patch('/rename', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API Изменение названия отряда прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API Изменение названия отряда прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        let squadList
        const squadId = data.squadId

        if(data.team == 'Red') { squadList = currentEvent.slotsTeam1 }
        else if(data.team == 'Blue') { squadList = currentEvent.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API Изменение названия отряда прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            console.log(`[${GetDateInfo().all}] API Изменение названия отряда прервано. Отряд не найден`)

            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) {
            console.log(`[${GetDateInfo().all}] API Изменение названия отряда прервано. Попытка изменения отряда 0`)
            return res.json({ status: 400, err: 'You can\'t rename squad with id 0' })
        }

        squadList[squadId].title = data.title

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        console.log(`[${GetDateInfo().all}] API название отряда ${squadId} команды ${data.team} в событии ${currentEvent.id} успешно изменено администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/rename - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/rename - ${e}`
        });
    };
})




// CHANGE SLOT NAME
router.patch('/slots/rename', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API изменение названия слота прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API изменение названия слота прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        let squadList
        const squadId = data.squadId
        const slotId = data.slotId


        if(data.team == 'Red') { squadList = currentEvent.slotsTeam1 }
        else if(data.team == 'Blue') { squadList = currentEvent.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API изменение названия слота прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            console.log(`[${GetDateInfo().all}] API изменение названия слота прервано. Отряд не найден`)

            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) {
            console.log(`[${GetDateInfo().all}] API изменение названия слота прервано. Попытка изменения отряда 0`)
            return res.json({ status: 400, err: 'You can\'t rename slots in squad with id 0' })
        }

        if(!squadList[squadId].slots[slotId]){
            console.log(`[${GetDateInfo().all}] API изменение названия слота прервано. Слот не найден`)

            res.json({
                status: 404,
                err: 'Slot by id undefined'
            })
            return
        }

        squadList[squadId].slots[slotId].title = data.title

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }


        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        console.log(`[${GetDateInfo().all}] API название слота ${slotId} в отряде ${squadId} команды ${data.team} в событии ${currentEvent.id} успешно изменено администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/slots/rename - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/rename - ${e}`
        });
    };
})



// SLOT LEAVE
router.patch('/slots/freeup/personally', AccountCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API снятие со слота пользователем прервано. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API снятие со слота пользователем прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Event undefined'
            })
            return
        }

        foundEvent.slotsTeam1.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === user.id) {
                    foundEvent.slotsTeam1[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === user.id) {
                        foundEvent.slotsTeam1[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        foundEvent.slotsTeam2.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === user.id) {
                    foundEvent.slotsTeam2[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === user.id) {
                        foundEvent.slotsTeam2[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        foundEvent.setDataValue('slotsTeam1', foundEvent.slotsTeam1)
        foundEvent.setDataValue('slotsTeam2', foundEvent.slotsTeam2)
        foundEvent.changed('slotsTeam1', true);
        foundEvent.changed('slotsTeam2', true);
        await foundEvent.save();

        console.log(`[${GetDateInfo().all}] API пользователь ${user.id} успешно снят со всех слотов в событии ${foundEvent.id} добровольно`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/slots/freeup/personally - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/freeup/personally - ${e}`
        });
    };
})



// FORCE SLOT LEAVE
router.patch('/slots/freeup/force', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user) {
            console.log(`[${GetDateInfo().all}] API снятие со слота администратором прервано. Администратор не найден`)

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
            console.log(`[${GetDateInfo().all}] API снятие со слота администратором прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Event undefined'
            })
            return
        }

        foundEvent.slotsTeam1.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === data.userId) {
                    foundEvent.slotsTeam1[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === data.userId) {
                        foundEvent.slotsTeam1[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        foundEvent.slotsTeam2.forEach((squadItem, squadIndex) => {
            if(squadIndex === 0) {
                if(squadItem.player === data.userId) {
                    foundEvent.slotsTeam2[squadIndex].player = null
                }
            } else {
                squadItem.slots.forEach((slotItem, slotIndex) => {
                    if(slotItem.player === data.userId) {
                        foundEvent.slotsTeam2[squadIndex].slots[slotIndex].player = null
                    }
                })
            }
        });

        foundEvent.setDataValue('slotsTeam1', foundEvent.slotsTeam1)
        foundEvent.setDataValue('slotsTeam2', foundEvent.slotsTeam2)
        foundEvent.changed('slotsTeam1', true);
        foundEvent.changed('slotsTeam2', true);
        await foundEvent.save();

        console.log(`[${GetDateInfo().all}] API пользователь ${data.userId} успешно снят со всех слотов в событии ${foundEvent.id} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/slots/freeup/force - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/freeup/force - ${e}`
        });
    };
})



// SET HQ STATUS
router.patch('/setHQ', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API Изменение HQ статуса прервано. Пользователь не найден`)

            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
            console.log(`[${GetDateInfo().all}] API Изменение HQ статуса прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        let squadList
        const squadId = data.squadId

        if(data.team == 'Red') { squadList = currentEvent.slotsTeam1 }
        else if(data.team == 'Blue') { squadList = currentEvent.slotsTeam2 }
        else {
            console.log(`[${GetDateInfo().all}] API Изменение HQ статуса прервано. Команда указана неверно`)

            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            console.log(`[${GetDateInfo().all}] API Изменение HQ статуса прервано. Отряд не найден`)

            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) {
            console.log(`[${GetDateInfo().all}] API Изменение HQ статуса прервано. Попытка изменения отряда 0`)
            return res.json({ status: 400, err: 'You can\'t rename squad with id 0' })
        }

        squadList[squadId].hq = data.isHQ

        squadList.forEach((item, itemIndex) => {
            if(itemIndex !== data.squadId) squadList[itemIndex].hq = false
        });

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        console.log(`[${GetDateInfo().all}] API HQ статус отряда ${squadId} в событии ${data.eventId} успешно изменен на ${data.isHQ} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/squad/setHQ - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/setHQ - ${e}`
        });
    };
})



export default router;