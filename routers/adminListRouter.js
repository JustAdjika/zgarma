import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

import ADMINS_TAB from '../database/adminList.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js';

const router = express.Router();
router.use(bodyParser.json());
dotenv.config()


console.log(`\x1b[34m |!|    ADMINS ROUTER READY   |!|\x1b[0m`);

// ADD ADMINISTRATOR
router.post('/add', async(req, res) => {
    try {
        const data = req.body

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAccount) {
            console.log(`[${GetDateInfo().all}] Выдача прав администратора прервана. Аккаунт не найден`)

            return res.json({
                status: 404,
                err: 'Account key undefined'
            })
        }


        if(data.masterKey !== process.env.MASTER_KEY) {
            console.log(`[${GetDateInfo().all}] ВНИМАНИЕ! ПОПЫТКА ВЫДАЧИ ПРАВ АДМИНИСТРАТОРА ПОЛЬЗОВАТЕЛЮ ${foundAccount.id}. МАСТЕР КЛЮЧ НЕВЕРНЫЙ`)

            return res.json({
                status: 403,
                err: 'ACCESS DENIED. MASTER KEY IS NOT SUITABLE'
            })
        }

        const foundConsilience = await ADMINS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(foundConsilience) {
            console.log(`[${GetDateInfo().all}] Выдача прав администратора прервана. Этот пользователь уже администратор`)

            return res.json({
                status: 409,
                err: 'This user is already an administrator'
            })
        }

        await ADMINS_TAB.create({
            key: data.key,
            role: 'Administrator'
        })

        console.log(`[${GetDateInfo().all}] Права администратора успешно выданы пользователю ${foundAccount.id}`)

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: adminlist/remote/add - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: adminlist/remote/add - ${e}`
        });
    }
});



// DELETE ADMINISTRATOR
router.delete('/delete', async(req, res) => {
    try {
        const data = req.body

        if(data.masterKey !== process.env.MASTER_KEY) {
            console.log(`[${GetDateInfo().all}] ВНИМАНИЕ! ПОПЫТКА УДАЛЕНИЯ ПРАВ АДМИНИСТРАТОРА. МАСТЕР КЛЮЧ НЕВЕРНЫЙ`)

            return res.json({
                status: 403,
                err: 'ACCESS DENIED. MASTER KEY IS NOT SUITABLE'
            })
        }

        const foundAdministrator = await ADMINS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAdministrator) {
            console.log(`[${GetDateInfo().all}] Удаление прав администратора прервано. Администратор не найден`)

            return res.json({
                status: 404,
                err: 'Administrator undefined'
            })
        }

        await foundAdministrator.destroy()

        console.log(`[${GetDateInfo().all}] Права администратора успешно удалены`)

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: adminlist/remote/delete - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: adminlist/remote/delete - ${e}`
        });
    }
});




// CHECK ADMINISTRATOR STATUS
router.get('/isAdmin', async(req, res) => {
    try {
        const userid = req.query.id

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                id: userid
            }
        })

        if(!foundAccount) {
            console.log(`[${GetDateInfo().all}] API Проверка прав администратора прервана. Пользователь не найден`)

            return res.json({
                status: 404,
                err: 'User id undefined',
                container: false
            })
        }

        const foundAdministrator = await ADMINS_TAB.findOne({
            where: {
                key: foundAccount.key
            }
        })

        if(foundAdministrator) {
            console.log(`[${GetDateInfo().all}] API Права администратора у пользователя ${userid} проверены. TRUE`)

            res.json({
                status: 200,
                container: true
            })
        }else{
            console.log(`[${GetDateInfo().all}] API Права администратора у пользователя ${userid} проверены. FALSE`)

            res.json({
                status: 200,
                container: false
            })
        }
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: adminlist/remote/isAdmin - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: adminlist/remote/isAdmin - ${e}`
        });
    }
});




router.post('/newAccount', async(req, res) => {
    try {
        const data = req.body

        if(data.masterKey !== process.env.MASTER_KEY) {
            console.log(`[${GetDateInfo().all}] ВНИМАНИЕ! ПОПЫТКА СОЗДАНИЯ DEV АККАУНТА. МАСТЕР КЛЮЧ НЕВЕРНЫЙ`)

            return res.json({
                status: 403,
                err: 'ACCESS DENIED. MASTER KEY IS NOT SUITABLE'
            })
        }

        const newDevAcc = await ACCOUNTS_TAB.create({
            key: null,
            discord: null,
            steam: null
        })

        const discordDevAcc = {
            username: `devAcc_${newDevAcc.id}`,
            id: '596738020065935360',
        }
        const steamDevAcc = {
            personaname: `devAcc_${newDevAcc.id}`
        }

        await newDevAcc.update({
            key: `devKey_${newDevAcc.id}`,
            discord: discordDevAcc,
            steam: steamDevAcc
        })

        console.log(`[${GetDateInfo().all}] Новый DEV аккаунт успешно создан`)

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: adminlist/remote/newAccount - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: adminlist/remote/newAccount - ${e}`
        });
    }
});



export default router;