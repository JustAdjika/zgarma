import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs } from 'fs'
import { readFile } from 'fs/promises';
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios';

import EVENTS_TAB from '../database/events.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'
import GetDateInfo from '../modules/dateInfo.js';

const router = express.Router();
router.use(bodyParser.json());

const host = process.env.BASIC_URL
const botKey = process.env.BOT_ACCESS_KEY

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`\x1b[34m |!|   EVENT_E ROUTER READY   |!|\x1b[0m`);



// EDIT INFO
router.patch('/info', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API изменение информации события прервано. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API изменение информации события прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        await currentEvent.update(data, {
            fields: ['title', 'description', 'time', 'date', 'metar', 'team1', 'team2']
        })

        console.log(`[${GetDateInfo().all}] API информация о событии ${currentEvent.id} успешно изменена администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/info - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/info - ${e}`
        });
    };
})



// OPEN EVENT
router.post('/status/:status', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API изменение статуса события прервано. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API изменение статуса события прервано. Событие не найдено`)

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
                eventid: currentEvent.dataValues.id,
                botKey: botKey,
                devBranch: data.devBranch
            })
        } else if(req.params.status == "close") {
            await currentEvent.update({
                status: 'CLOSED'
            })

            axios.post(`${host}/api/developer/bot/eventAnnouncements/close`, {
                eventTeam1: currentEvent.dataValues.team1,
                eventTeam2: currentEvent.dataValues.team2,
                eventTitle: currentEvent.dataValues.title,
                botKey: botKey,
                devBranch: data.devBranch
            })
        } else if(req.params.status == 'continue') {
            await currentEvent.update({
                status: 'CONTINUE'
            })
        } else {
            console.log(`[${GetDateInfo().all}] API изменение статуса события прервано. Статус указан неверно`)

            res.json({
                status: 404,
                err: 'Bad request'
            })
            return
        }

        console.log(`[${GetDateInfo().all}] API статус события ${currentEvent.id} успешно изменен на ${req.params.status} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/status/open - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/status/open - ${e}`
        });
    };
})


// DELETE EVENT
router.delete('/delete', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API удаление события прервано. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API удаление события прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        await currentEvent.destroy()

        console.log(`[${GetDateInfo().all}] API событие успешно удалено администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/delete - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/delete - ${e}`
        });
    };
})



// PVP/PVE SELECT
router.patch('/type', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API изменение типа события прервано. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API изменение типа события прервано. Событие не найдено`)

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

        console.log(`[${GetDateInfo().all}] API тип события ${currentEvent.id} успешно изменен на IS_PVP_ON: ${data.isPvpOn} администратором ${user.id}`)

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/type - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/type - ${e}`
        });
    };
})




// IMAGE UPLOAD
router.post('/imgupload', AccountCheck, PermissionsCheck, async(req,res) => {
    try {
        const userKey = req.body.key
        const eventId = Number(req.body.eventId)

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: userKey
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API загрузка изображения на событие прервано. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API загрузка изображения на событие прервано. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        if(!req.files || !req.files.file) {
            console.log(`[${GetDateInfo().all}] API загрузка изображения на событие прервано. Файл не загружен`)

            res.json({
                status: 400,
                err: 'File is not uploaded'
            })
            return
        }

        if(Array.isArray(req.files.file)) {
            console.log(`[${GetDateInfo().all}] API загрузка изображения на событие прервано. Больше одного файла`)

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
                console.log(`[${GetDateInfo().all}] API непредвиденная ошибка загрузки изображения на событие: ${err}`)

                res.json({
                    status: 500,
                    err
                })
                return 
            }
        })

        await currentEvent.update({
            imgPath: `eventImages/${newFileName}`
        })

        console.log(`[${GetDateInfo().all}] API изображение успешно загружено на событие ${currentEvent.id} администратором ${user.id} по индексу ${newFileName}`)

        res.json({
            status: 200
        })
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/imgupload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/imgupload - ${e}`
        });
    }
})




// MODS UPLOAD
router.post('/modsupload', AccountCheck, PermissionsCheck, async(req,res) => {
    try {
        const userKey = req.body.key
        const eventId = Number(req.body.eventId)

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: userKey
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API загрузка модпака прервана. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API загрузка модпака прервана. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        if(!req.files || !req.files.file) {
            console.log(`[${GetDateInfo().all}] API загрузка модпака прервана. Файл не загружен`)

            res.json({
                status: 400,
                err: 'File is not uploaded'
            })
            return
        }

        if(Array.isArray(req.files.file)) {
            console.log(`[${GetDateInfo().all}] API загрузка модпака прервана. Больше одного файла`)

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
                console.log(`[${GetDateInfo().all}] API непредвиденная ошибка загрузки модпака на событие: ${err}`)

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

        console.log(`[${GetDateInfo().all}] API модпак на событие ${currentEvent.id} успешно загружен администратором ${user.id} по индексу ${newFileName}`)

        res.json({
            status: 200
        })
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/modsupload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/modsupload - ${e}`
        });
    }
})



// Экспорт сохранения отрядов
router.get('/data/download/save/:eventId', async (req, res) => {
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

        const saveData = [
            currentEvent.slotsTeam1,
            currentEvent.slotsTeam2,
            currentEvent.vehTeam1,
            currentEvent.vehTeam2
        ]

        const cacheName = `save_${uuidv4()}.json`;
        const cachePath = __dirname + "/../cache/" + cacheName

        await fs.writeFile(cachePath, JSON.stringify(saveData, null, 2))

        console.log(`[${GetDateInfo().all}] API выдано сохранение события ${currentEvent.id}`)

        res.download(cachePath, async (err) => {
            if (err) {
                console.error("Ошибка при скачивании:", err);
            }

            await fs.unlink(cachePath)
        });
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/data/download/save - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/data/download/save - ${e}`
        });
    }
})



// Импорт сохранения
router.post('/saveUpload', AccountCheck, PermissionsCheck, async(req,res) => {
    try {
        const userKey = req.body.key
        const eventId = Number(req.body.eventId)

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: userKey
            }
        })

        if(!user){
            console.log(`[${GetDateInfo().all}] API загрузка сохранения прервана. Пользователь не найден`)

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
            console.log(`[${GetDateInfo().all}] API загрузка сохранения прервана. Событие не найдено`)

            res.json({
                status: 404,
                err: 'Current event undefined'
            })
            return
        }

        if(!req.files || !req.files.file) {
            console.log(`[${GetDateInfo().all}] API загрузка сохранения прервана. Файл не загружен`)

            res.json({
                status: 400,
                err: 'File is not uploaded'
            })
            return
        }

        if(Array.isArray(req.files.file)) {
            console.log(`[${GetDateInfo().all}] API загрузка сохранения прервана. Больше одного файла`)

            res.json({
                status: 400,
                err: 'More than one file has been uploaded'
            })
            return
        }

        const file = req.files.file
        const newFileName = `uploadSave_${uuidv4()}.json`;
        const cacheUploadPath = __dirname + "/../cache/" + newFileName

        file.mv(cacheUploadPath, async (err) => {
            if(err) {
                console.log(`[${GetDateInfo().all}] API непредвиденная ошибка загрузки сохранения на событие: ${err}`)

                res.json({
                    status: 500,
                    err
                })
                return 
            } else {
                const cacheContent = JSON.parse(await readFile(cacheUploadPath, 'utf-8'))

                await currentEvent.update({
                    slotsTeam1: cacheContent[0],
                    slotsTeam2: cacheContent[1],
                    vehTeam1: cacheContent[2],
                    vehTeam2: cacheContent[3],
                })

                await fs.unlink(cacheUploadPath)
            }
        })

        console.log(`[${GetDateInfo().all}] API сохранение на событие ${currentEvent.id} успешно загружен администратором ${user.id}`)

        res.json({
            status: 200
        })
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: event/edit/saveUpload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: event/edit/saveUpload - ${e}`
        });
    }
})


export default router;