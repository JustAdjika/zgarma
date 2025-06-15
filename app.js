// DEPENDENCIES
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'
import cron from 'node-cron'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

// MODULES
import sequelize from './database/pool.js'
import GetDateInfo from './modules/dateInfo.js'
import PermissionsCheck from './modules/permissions.js'
import AccountCheck from './modules/accountCheck.js'

// DATABASE
import ACCOUNTS_TAB from './database/accounts.js'
import POSTS_TAB from './database/posts.js'
import BUG_TICKETS_TAB from './database/bugTickets.js'
import BUG_FIXES_TAB from './database/bugFixes.js'
import EVENTS_TAB from './database/events.js'
import NOTICES_TAB from './database/notices.js'
import FAQ_TAB from './database/faq.js'
import EVENT_REQUESTS_TAB from './database/eventRequests.js'
import ADMINS_TAB from './database/adminList.js'

// ROUTERS
import accountRouter from './routers/accountRouter.js'
import postRouter from './routers/postRouter.js'
import bugfixRouter from './routers/bugfixRouter.js'
import bugticketRouter from './routers/bugticketRouter.js'
import eventRouter from './routers/eventRouter.js'
import eventEditRouter from './routers/eventEditRouter.js'
import eventSquadRouter from './routers/eventSquadRouter.js'
import eventVehRouter from './routers/eventVehRouter.js'
import eventRequestRouter from './routers/eventRequestRouter.js'
import adminList from './routers/adminListRouter.js'
import discordBot from './routers/discordBot.js'
import faqRouter from './routers/faqRouter.js'

// CONFIG
const app = express()
app.use(bodyParser.json())

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const rest = new REST({ version: 10 }).setToken(BOT_TOKEN)

app.use(cors({
    origin: ["http://zgarma.ru", "https://zgarma.ru", "http://dev.zgarma.ru", "https://dev.zgarma.ru"], // Разрешаем запросы с этого домена
    credentials: true,           // Разрешаем передачу куков
    methods: "GET,POST,PUT,DELETE,PATCH", // Разрешённые методы
    allowedHeaders: "*", // Разрешённые заголовки
}));
app.use(fileUpload())

const startServer = async () => {
    try {
        console.log("Ожидание создания всех таблиц...");

        // Ждем, пока все таблицы создадутся
        await sequelize.sync({ alter: true });

        console.log("Все таблицы созданы!");

        // Запуск сервера после успешного создания всех таблиц
        app.listen(3000, '0.0.0.0', () => {
            console.log('\x1b[35m |!-------- API STARTED -------!| \x1b[0m');
        });

        // USE ROUTER (регистрируем маршруты только после старта сервера)
        app.use('/api/developer/account', accountRouter);
        app.use('/api/developer/post', postRouter);
        app.use('/api/developer/faq', faqRouter);
        app.use('/api/developer/bugfix/notes', bugfixRouter);
        app.use('/api/developer/bugfix/tickets', bugticketRouter);
        app.use('/api/developer/event', eventRouter);
        app.use('/api/developer/event/edit', eventEditRouter);
        app.use('/api/developer/event/edit/vehicle', eventVehRouter);
        app.use('/api/developer/event/edit/squad', eventSquadRouter);
        app.use('/api/developer/event/request', eventRequestRouter);
        app.use('/api/developer/adminlist/remote', adminList);
        app.use('/api/developer/bot', discordBot);

        app.get('/healthcheck', async (req, res) => {
            return res.json({ status: 200 })
        })

        const delay = (ms) => new Promise((res) => setTimeout(res, ms));

        const updateUsersInfo = async(cron = false) => {
            console.log(`[${GetDateInfo().all}] ${cron ? 'CRON Process' : 'Ручное обновление'}: Запуск обновления пользователей...`);

            const users = await ACCOUNTS_TAB.findAll(); 

            for (const user of users) {
                try {
                    const updated = await rest.get(Routes.user(user.discord.id)); // запрос к Discord API

                    const userDB = await ACCOUNTS_TAB.findOne({
                        where: {
                            id: user.id
                        } 
                    })

                    await userDB.update({
                        discord: updated
                    })

                    console.log(`[${GetDateInfo().all}] ${cron ? 'CRON Process' : 'Ручное обновление'}: Обновлен пользователь ${user.id}`);
                } catch (err) {
                    console.error(`[${GetDateInfo().all}] ${cron ? 'CRON Process' : 'Ручное обновление'}: Ошибка обновления пользователя ${user.id}:`, err?.message || err);
                }
                await delay(200); // 5 запросов/сек
            }

            console.log(`[${GetDateInfo().all}] ${cron ? 'CRON Process' : 'Ручное обновление'}: Обновление завершено.`);
        } 




        cron.schedule('0 */3 * * *', async () => {
            await updateUsersInfo(true)
        });

        app.post('/api/developer/updateUsersInfo', AccountCheck, PermissionsCheck, async (req, res) => {
            await updateUsersInfo(false)
            res.json({status: 200})
        })

        app.post('/me', AccountCheck, async (req,res) => {
            const key = req.body.key

            try {
                const actualData = await ACCOUNTS_TAB.findOne({
                    where: {
                        key: key
                    }
                })

                res.json({
                    status: 200,
                    container: actualData
                })


                console.log(`[${GetDateInfo().all}] Успешное получение актуальной информации`)

                return
            } catch (e) {
                res.json({status: 500, err: e})
                console.log(`[${GetDateInfo().all}] Непредвиденная ошибка при получении актуальной информации: ${e}`)
                return
            }
        })

    } catch (error) {
        console.error("Ошибка при создании таблиц:", error);
    }
};

startServer(); 

