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

        if(data.masterKey !== process.env.MASTER_KEY) {
            return res.json({
                status: 403,
                err: 'ACCESS DENIED. MASTER KEY IS NOT SUITABLE'
            })
        }

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAccount) {
            return res.json({
                status: 404,
                err: 'Account key undefined'
            })
        }

        const foundConsilience = await ADMINS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(foundConsilience) {
            return res.json({
                status: 409,
                err: 'This user is already an administrator'
            })
        }

        await ADMINS_TAB.create({
            key: data.key,
            role: 'Administrator'
        })

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31mApi developer error: adminlist/remote/add - ${e} \x1b[0m`);
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
            return res.json({
                status: 404,
                err: 'Administrator undefined'
            })
        }

        await foundAdministrator.destroy()

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31mApi developer error: adminlist/remote/delete - ${e} \x1b[0m`);
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
            return res.json({
                status: 404,
                err: 'User id undefined'
            })
        }

        const foundAdministrator = await ADMINS_TAB.findOne({
            where: {
                key: foundAccount.key
            }
        })

        if(foundAdministrator) {
            res.json({
                status: 200,
                container: true
            })
        }else{
            res.json({
                status: 200,
                container: false
            })
        }
    } catch (e) {
        console.error(`\x1b[31mApi developer error: adminlist/remote/isAdmin - ${e} \x1b[0m`);
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

        res.json({
            status: 200
        })
    } catch (e) {
        console.error(`\x1b[31mApi developer error: adminlist/remote/newAccount - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: adminlist/remote/newAccount - ${e}`
        });
    }
});



export default router;