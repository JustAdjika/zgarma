import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

import FAQ_TAB from '../database/faq.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'
import GetDateInfo from '../modules/dateInfo.js'

const router = express.Router();
router.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`\x1b[34m |!|     FAQ ROUTER READY     |!|\x1b[0m`);



// IMAGE UPLOAD
router.post('/imgupload', AccountCheck, PermissionsCheck, async(req,res) => {
    try {
        const userKey = req.body.key

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: userKey
            }
        })

        if(!user){
            console.log(`[${GetDateInfo.all}] API Загрузка изображения в FAQ прервана. Пользователь не найден`)
            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        if(!req.files || !req.files.file) {
            console.log(`[${GetDateInfo.all}] API Загрузка изображения в FAQ прервана. Изображения нет`)
            res.json({
                status: 400,
                err: 'File is not uploaded'
            })
            return
        }

        if(Array.isArray(req.files.file)) {
            console.log(`[${GetDateInfo.all}] API Загрузка изображения в FAQ прервана. Файлов несколько`)
            res.json({
                status: 400,
                err: 'More than one file has been uploaded'
            })
            return
        }

        const file = req.files.file
        const newFileName = uuidv4() + path.extname(file.name);
        const uploadPath = __dirname + "/../files/faqImages/" + newFileName

        file.mv(uploadPath, (err) => {
            if(err) {
                console.log(`[${GetDateInfo.all}] API Загрузка изображения в FAQ прервана. ${err}`)
                res.json({
                    status: 500,
                    err
                })
                return 
            }
        })

        console.log(`[${GetDateInfo.all}] API Изображение успешно загружено в FAQ`)

        res.json({
            status: 200,
            container: uploadPath
        })
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo.all}] Api developer error: faq/imgupload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: faq/imgupload - ${e}`
        });
    }
})



// FAQ OBJECT LOADER
router.put('/upload', AccountCheck, PermissionsCheck, async(req,res) => {
    try {
        const data = req.body

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            console.log(`[${GetDateInfo.all}] API загрузка объекта FAQ на сервер прервана. Пользователь не найден`)
            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }

        await FAQ_TAB.destroy({
            where: {},
            truncate: true
        });
        console.log(`[${GetDateInfo.all}] API при загрузке нового объекта FAQ, старый был уничтожен`)

        data.faqs.forEach(async (element) => {
            await FAQ_TAB.create({
                title: element.title,
                content: element.content
            })
        });

        console.log(`[${GetDateInfo.all}] API новый объект FAQ загружен на сервер`)

        res.json({
            status: 200
        })
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo.all}] Api developer error: faq/upload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: faq/upload - ${e}`
        });
    }
})



// GET FAQ OBJECT 
router.get('/data/all', async(req,res) => {
    try {
        const container = await FAQ_TAB.findAll()

        console.log(`[${GetDateInfo.all}] API Объект FAQ получен`)

        res.json({
            status: 200,
            container
        })
    } catch(e) {
        console.error(`\x1b[31m[${GetDateInfo.all}] Api developer error: faq/upload - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: faq/upload - ${e}`
        });
    }
})

export default router;