import express from 'express';
import bodyParser from 'body-parser';

import ACCOUNTS_TAB from '../database/accounts.js';
import EVENTS_TAB from '../database/events.js';

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|   EVENT_V ROUTER READY   |!|\x1b[0m`);


// ADD NEW VEHICLE SLOT
router.post('/add', async(req, res) => {
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

        const newVehicle = {
            title: "New vehicle",
            count: 1
        }

        let oldVehicle

        if(data.team == 'Red') { oldVehicle = currentEvent.dataValues.vehTeam1 }
        else if(data.team == 'Blue') { oldVehicle = currentEvent.dataValues.vehTeam2 }
        else {
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }


        const updateVehicle = [...JSON.parse(oldVehicle), newVehicle]


        if(data.team == 'Red') { await currentEvent.update({vehTeam1: updateVehicle}) }
        else if(data.team == 'Blue') { await currentEvent.update({vehTeam2: updateVehicle}) }
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
        console.error(`\x1b[31mApi developer error: event/edit/vehicle/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/vehicle/add - ${e}`
        });
    };
})



// VEHICLE SLOT EDIT
router.patch('/', async(req, res) => {
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

        let vehicleList
        const vehId = data.vehId

        if(data.team == 'Red') { vehicleList = JSON.parse(currentEvent.vehTeam1) }
        else if(data.team == 'Blue') { vehicleList = JSON.parse(currentEvent.vehTeam2) }
        else {
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!vehicleList[vehId]){
            res.json({
                status: 404,
                err: 'Vehicle by id undefined'
            })
            return
        }

        const newData = {};

        if (data.title !== undefined) newData.title = data.title;
        if (data.count !== undefined) newData.count = data.count; 

        vehicleList[vehId] = {...vehicleList[vehId], ...newData}


        if(data.team == 'Red') { await currentEvent.update({vehTeam1: vehicleList}) }
        else if(data.team == 'Blue') { await currentEvent.update({vehTeam2: vehicleList}) }
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
        console.error(`\x1b[31mApi developer error: event/edit/vehicle/ - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/vehicle/ - ${e}`
        });
    };
})





// VEHICLE SLOT DELETE
router.delete('/delete', async(req, res) => {
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

        let vehicleList
        const vehId = data.vehId

        if(data.team == 'Red') { vehicleList = JSON.parse(currentEvent.vehTeam1) }
        else if(data.team == 'Blue') { vehicleList = JSON.parse(currentEvent.vehTeam2) }
        else {
            res.json({
                status: 404,
                err: 'You can only indicate the Blue and Red command'
            })
            return
        }

        if(!vehicleList[vehId]){
            res.json({
                status: 404,
                err: 'Vehicle by id undefined'
            })
            return
        }

        vehicleList.splice(vehId, 1)

        if(data.team == 'Red') { await currentEvent.update({vehTeam1: vehicleList}) }
        else if(data.team == 'Blue') { await currentEvent.update({vehTeam2: vehicleList}) }
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
        console.error(`\x1b[31mApi developer error: event/edit/vehicle/delete - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/vehicle/delete - ${e}`
        });
    };
})


export default router;