import express from 'express';
import bodyParser from 'body-parser';

import ACCOUNTS_TAB from '../database/accounts.js';
import EVENTS_TAB from '../database/events.js';

import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'

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
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        console.log(oldSquadList)

        const updateSquadList = [...oldSquadList, newSquad]

        console.log(updateSquadList)

        if(data.team == 'Red') { await currentEvent.update({slotsTeam1: updateSquadList}) }
        else if(data.team == 'Blue') { await currentEvent.update({slotsTeam2: updateSquadList}) }
        else {
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command (2lvl)'
            })
            return
        }

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/squad/add - ${e} \x1b[31m`);
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
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) return res.json({ status: 400, err: 'You can\'t delete squad with id 0' })

        squadList.splice(squadId, 1)

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/squad/delete - ${e} \x1b[31m`);
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
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        let squadListParsed = oldSquadList
        const findedSquad = squadListParsed[squadId]

        if(!findedSquad) {
            res.json({
                status: 404,
                err: 'Squad by id is undefined'
            })
            return
        }

        if(squadId == 0) return res.json({status: 400, err: 'You can\'t add new slot to squad with id 0'})

        const oldSlots = squadListParsed[squadId].slots
        squadListParsed[squadId].slots = [...oldSlots, newSlot]



        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadListParsed) }
        else { currentEvent.setDataValue('slotsTeam2', squadListParsed) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/squad/slots/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/add - ${e}`
        });
    };
})




// DELETE SQUAD SLOT
router.delete('/slots/delete', AccountCheck, PermissionsCheck, async(req, res) => {
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

        const currentEvent = await EVENTS_TAB.findOne({
            where: {
                id: data.eventId
            }
        })

        if(!currentEvent){
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
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }



        if(!squadList[squadId]){
            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) return res.json({ status: 400, err: 'You can\'t delete slots from squad with id 0' })

        if(!squadList[squadId].slots[slotId]) {
            res.json({
                status: 404,
                err: 'Slot by id undefined'
            })
            return
        }

        if(slotId == 0) return res.json({ status: 400, err: 'You can\'t delete slot with id 0' })

        squadList[squadId].slots.splice(slotId, 1)

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/squad/slots/delete - ${e} \x1b[31m`);
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
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) return res.json({ status: 400, err: 'You can\'t rename squad with id 0' })

        squadList[squadId].title = data.title

        if(data.team == 'Red') { currentEvent.setDataValue('slotsTeam1', squadList) }
        else { currentEvent.setDataValue('slotsTeam2', squadList) }

        currentEvent.changed('slotsTeam1', true);
        currentEvent.changed('slotsTeam2', true);
        await currentEvent.save();

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/squad/rename - ${e} \x1b[31m`);
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
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!squadList[squadId]){
            res.json({
                status: 404,
                err: 'Squad by id undefined'
            })
            return
        }

        if(squadId == 0) return res.json({ status: 400, err: 'You can\'t rename slots in squad with id 0' })

        if(!squadList[squadId].slots[slotId]){
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


        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/squad/slots/rename - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/squad/slots/rename - ${e}`
        });
    };
})



export default router;