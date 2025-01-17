import express from 'express';
import bodyParser from 'body-parser';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|    EVENT ROUTER READY    |!|\x1b[0m`);

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

        const newEvent = EVENTS_TAB.create({
            status: 'READY',
            type: data.type,
            date: GetDateInfo.date,
            time: null,
            title: data.title,
            metar: data.metar,
            description: data.description,
            team1: data.team1,
            team2: data.type == 'PVE' ? null : data.team2,
            imgPath: null,
            slotsTeam1: null,
            slotsTeam2: null,
            vehTeam1: null,
            vehTeam2: null,
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

export default router;