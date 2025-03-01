import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import PermissionsCheck from '../modules/permissions.js'

const router = express.Router();
router.use(bodyParser.json());

const host = process.env.BASIC_URL
const botKey = process.env.BOT_ACCESS_KEY

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`\x1b[34m |!|   EVENT_E ROUTER READY   |!|\x1b[0m`);



// EDIT INFO
router.patch('/info', PermissionsCheck, async(req, res) => {
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

        await currentEvent.update(data, {
            fields: ['title', 'description', 'time', 'date', 'metar', 'team1', 'team2']
        })

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/info - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/info - ${e}`
        });
    };
})



// OPEN EVENT
router.post('/status/:status', PermissionsCheck, async(req, res) => {
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


        if(req.params.status == "open") {
            await currentEvent.update({
                status: 'OPEN'
            })

            axios.post(`${host}/api/developer/bot/eventAnnouncements/open`, {
                eventDate: currentEvent.dataValues.date,
                eventTime: currentEvent.dataValues.time,
                eventTeam1: currentEvent.dataValues.team1,
                eventTeam2: currentEvent.dataValues.team2,
                eventType: currentEvent.dataValues.type,
                eventTitle: currentEvent.dataValues.title,
                botKey: botKey
            })
        } else if(req.params.status == "close") {
            await currentEvent.update({
                status: 'CLOSED'
            })

            axios.post(`${host}/api/developer/bot/eventAnnouncements/close`, {
                eventTeam1: currentEvent.dataValues.team1,
                eventTeam2: currentEvent.dataValues.team2,
                eventTitle: currentEvent.dataValues.title,
                botKey: botKey
            })
        } else {
            res.json({
                status: 404,
                err: 'Bad request'
            })
            return
        }

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/status/open - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/status/open - ${e}`
        });
    };
})


// DELETE EVENT
router.delete('/delete', PermissionsCheck, async(req, res) => {
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

        await currentEvent.destroy()

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/delete - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/delete - ${e}`
        });
    };
})



// PVP/PVE SELECT
router.patch('/type', PermissionsCheck, async(req, res) => {
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

        if(data.isPvpOn){
            await currentEvent.update({
                type: 'PVP'
            })
        }else{
            await currentEvent.update({
                type: 'PVE'
            })
        }

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: event/edit/type - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/type - ${e}`
        });
    };
})




// IMAGE UPLOAD
router.post('/imgupload', PermissionsCheck, async(req,res) => {
    try {
        const userKey = req.body.key
        const eventId = Number(req.body.eventId)

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: userKey
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

        if(!req.files || !req.files.file) {
            res.json({
                status: 400,
                err: 'File is not uploaded'
            })
            return
        }

        if(Array.isArray(req.files.file)) {
            res.json({
                status: 400,
                err: 'More than one file has been uploaded'
            })
            return
        }

        const file = req.files.file
        const newFileName = uuidv4() + path.extname(file.name);
        const uploadPath = __dirname + "/../files/eventImages/" + newFileName

        file.mv(uploadPath, (err) => {
            if(err) {
                res.json({
                    status: 500,
                    err
                })
                return 
            }
        })

        await currentEvent.update({
            imgPath: uploadPath
        })

        res.json({
            status: 200
        })
    } catch(e) {
        console.error(`\x1b[31mApi developer error: event/edit/imgupload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/imgupload - ${e}`
        });
    }
})




// MODS UPLOAD
router.post('/modsupload', PermissionsCheck, async(req,res) => {
    try {
        const userKey = req.body.key
        const eventId = Number(req.body.eventId)

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: userKey
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

        if(!req.files || !req.files.file) {
            res.json({
                status: 400,
                err: 'File is not uploaded'
            })
            return
        }

        if(Array.isArray(req.files.file)) {
            res.json({
                status: 400,
                err: 'More than one file has been uploaded'
            })
            return
        }

        const file = req.files.file
        const newFileName = uuidv4() + path.extname(file.name);
        const uploadPath = __dirname + "/../files/eventModPacks/" + newFileName

        file.mv(uploadPath, (err) => {
            if(err) {
                res.json({
                    status: 500,
                    err
                })
                return 
            }
        })

        await currentEvent.update({
            modsPath: uploadPath
        })

        res.json({
            status: 200
        })
    } catch(e) {
        console.error(`\x1b[31mApi developer error: event/edit/modsupload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/modsupload - ${e}`
        });
    }
})

export default router;