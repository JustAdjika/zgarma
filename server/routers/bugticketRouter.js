import express from 'express';
import bodyParser from 'body-parser';

import BUG_TICKETS_TAB from '../database/bugTickets.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!| BUG_TICKETS ROUTER READY |!|\x1b[0m`);

// GET ALL TICKETS
router.get('/data/all', async(req,res) => {
    try{
        const container = await BUG_TICKETS_TAB.findAll()

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
        console.error(`\x1b[31mApi developer error: bugfix/tickets/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/tickets/data/all - ${e}`
        });
    };
});

// ADD NEW TICKET
router.post('/add', async(req,res) => {
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

        const container = await BUG_TICKETS_TAB.create({
            title: data.title,
            content: data.content,
            date: GetDateInfo.date,
            status: 'NOT CHECKED',
            author: user.id,
            isRepeat: data.isRepeat
        })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: bugfix/tickets/add - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/tickets/add - ${e}`
        });
    };
});

// CHANGE TICKET STATUS
router.patch('/status/set', async(req,res) => {
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

        const ticket = await BUG_TICKETS_TAB.findOne({
            where: {
                id: data.ticketId
            }
        })

        if(!ticket){
            res.json({
                status: 404,
                err: 'Ticket undefined'
            })
            return
        }

        ticket.update({ status: data.status })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: bugfix/tickets/status/set - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bugfix/tickets/status/set - ${e}`
        });
    };
});


export default router;