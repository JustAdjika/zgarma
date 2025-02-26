import express from 'express';
import bodyParser from 'body-parser';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';
import EVENT_REQUESTS_TAB from '../database/eventRequests.js';
import NOTICES_TAB from '../database/notices.js'

import GetDateInfo from '../modules/dateInfo.js'
import PermissionsCheck from '../modules/permissions.js'

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|   EVENT_R ROUTER READY   |!|\x1b[0m`);


// GET ALL REQUESTS
router.post('/data/all', PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
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

        res.json({
            status: 200,
            container
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/request/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/data/all - ${e}`
        });
    };
})



// ADD NEW REQUEST
router.post('/add', async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
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
            res.json({
                status: 404,
                err: 'Event undefined'
            })
            return
        }

        if( !data.team || data.squad === null || data.slot === null || data.maybeSL === null || data.maybeTL === null ) {
            res.json({
                status: 400,
                err: 'One of the parameters is not specified'
            })
            return
        }

        const slots = data.team === 'Red'
            ? JSON.parse(foundEvent.dataValues.slotsTeam1)
            : data.team === 'Blue'
            ? JSON.parse(foundEvent.dataValues.slotsTeam2)
            : "Undefined"

        if(slots === 'Undefined') {
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
            if(!squad) return res.json({status: 404, err: 'This squad is undefined'})

            slot = squad.slots[data.slot]
        }

        if(!slot) {
            res.json({
                status: 404,
                err: 'This slot is undefined',
            })
            return
        }

        if(slot.player != null) {
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

        await EVENT_REQUESTS_TAB.create({
            userId: user.id,
            eventId: foundEvent.id,
            team: data.team,
            squad: data.squad,
            slot: data.slot,
            maybeSL: data.maybeSL,
            maybeTL: data.maybeTL,
            date: GetDateInfo.all
        })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/request/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/add - ${e}`
        });
    };
})




// CANCEL REQUEST
router.post('/cancel', PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
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
            res.json({
                status: 404,
                err: 'Destionation undefined'
            })
            return
        }



        await NOTICES_TAB.create({
            destination: foundDestination.id,
            content: `Ваша заявка в регистрации на игру была отклонена управляющим составом, по причине: ${data.reason}`,
            date: GetDateInfo.all
        })

        await foundRequest.destroy()

        res.json({
            status: 200
        })

    }catch(e){
        console.error(`\x1b[31mApi developer error: event/request/cancel - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/cancel - ${e}`
        });
    };
})






// ACCEPT REQUEST
router.post('/accept', PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key 
            }
        })

        if(!user) {
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


        let slots = foundRequest.team == 'Red'
            ? JSON.parse(event.dataValues.slotsTeam1)
            : JSON.parse(event.dataValues.slotsTeam2)

        if(foundRequest.squad === 0) {
            slots[foundRequest.squad].player = foundRequest.userId
        } else {
            slots[foundRequest.squad].slots[foundRequest.slot].player = foundRequest.userId
        }

        console.log(JSON.stringify(slots))

        if(foundRequest.team === 'Red') {
            await event.update({
                slotsTeam1: slots
            })
        } else {
            await event.update({
                slotsTeam2: slots
            })
        }


        await NOTICES_TAB.create({
            destination: foundDestination.id,
            content: `Ваша заявка в регистрации на роль "${data.eventSlot}" в игре "${data.eventTitle}" была одобрена`,
            date: GetDateInfo.all
        })

        await foundRequest.destroy()


        res.json({
            status: 200
        })

    }catch(e){
        console.error(`\x1b[31mApi developer error: event/request/cancel - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/request/cancel - ${e}`
        });
    };
})


export default router;