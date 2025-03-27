import express from 'express';
import bodyParser from 'body-parser';

import ACCOUNTS_TAB from '../database/accounts.js';
import EVENTS_TAB from '../database/events.js';

import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|   EVENT_V ROUTER READY   |!|\x1b[0m`);


// ADD NEW VEHICLE SLOT
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


        const updateVehicle = () => {
            let parsedData = [];
        
            if (typeof oldVehicle === "string" && oldVehicle.trim() !== "") {
                try {
                    parsedData = JSON.parse(oldVehicle);
                } catch (error) {
                    console.error(`\x1b[33mApi developer error: event/edit/vehicle/add: JSON parsing failed - ${error.message}\x1b[0m`);
                    return [newVehicle]; // Создаем новый массив
                }
            } else if (Array.isArray(oldVehicle)) {
                parsedData = oldVehicle;
            }
        
            if (Array.isArray(parsedData)) {
                return [...parsedData, newVehicle];
            } else {
                console.error(`\x1b[33mApi developer error: event/edit/vehicle/add: oldVehicle is not an array\x1b[0m`);
                return [newVehicle]; // Создаем новый массив
            }
        };


        if(data.team == 'Red') { await currentEvent.update({vehTeam1: updateVehicle()}) }
        else if(data.team == 'Blue') { await currentEvent.update({vehTeam2: updateVehicle()}) }
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
router.patch('/', AccountCheck, PermissionsCheck, async(req, res) => {
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

        if(data.team == 'Red') {  
            if(currentEvent.vehTeam1 && typeof currentEvent.vehTeam1 === 'string') {
                const parsedData = JSON.parse(currentEvent.vehTeam1)
                if(Array.isArray(parsedData) && parsedData.length > 0) {
                    vehicleList = parsedData
                } else if( Array.isArray(parsedData) && parsedData.length == 0 ) {
                    vehicleList = []
                }
            } else if (currentEvent.vehTeam1 && Array.isArray(currentEvent.vehTeam1)) {
                vehicleList = currentEvent.vehTeam1
            }
        }
        else if(data.team == 'Blue') { 
            if(currentEvent.vehTeam2 && typeof currentEvent.vehTeam2 === 'string') {
                const parsedData = JSON.parse(currentEvent.vehTeam2)
                if(Array.isArray(parsedData) && parsedData.length > 0) {
                    vehicleList = parsedData
                } else if( Array.isArray(parsedData) && parsedData.length == 0 ) {
                    vehicleList = []
                }
            } else if (currentEvent.vehTeam2 && Array.isArray(currentEvent.vehTeam2)) {
                vehicleList = currentEvent.vehTeam2
            }
        }
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

        if(data.team == 'Red') { currentEvent.setDataValue('vehTeam1', vehicleList); }
        else { currentEvent.setDataValue('vehTeam2', vehicleList);}

        currentEvent.changed('vehTeam1', true);
        currentEvent.changed('vehTeam2', true);
        await currentEvent.save();

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
router.delete('/delete', AccountCheck, PermissionsCheck, async (req, res) => {
    try {
        const { key, eventId, vehId, team } = req.body;

        const user = await ACCOUNTS_TAB.findOne({ where: { key } });
        if (!user) return res.json({ status: 404, err: 'User undefined' });

        const currentEvent = await EVENTS_TAB.findOne({ where: { id: eventId } });
        if (!currentEvent) return res.json({ status: 404, err: 'Current event undefined' });

        let vehicleList;
        if (team === 'Red') vehicleList = [...currentEvent.vehTeam1]; 
        else if (team === 'Blue') vehicleList = [...currentEvent.vehTeam2];
        else return res.json({ status: 404, err: 'You can only indicate the Blue and Red command' });

        if (vehId < 0 || vehId >= vehicleList.length) {
            return res.json({ status: 404, err: 'Vehicle by id undefined' });
        }




        vehicleList.splice(vehId, 1); 


        if (team === 'Red') {
            currentEvent.setDataValue('vehTeam1', vehicleList);
        } else {
            currentEvent.setDataValue('vehTeam2', vehicleList);
        }

        await currentEvent.save();

        res.json({ status: 200 });
    } catch (e) {
        console.error(`\x1b[31mApi developer error: event/edit/vehicle/delete - ${e} \x1b[31m`);
        res.json({ status: 500, err: `Api developer error: event/edit/vehicle/delete - ${e}` });
    }
});


export default router;