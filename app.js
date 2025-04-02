// DEPENDENCIES
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'

// MODULES
import sequelize from './database/pool.js'

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


app.use(cors({
    origin: ["http://zgarma.ru", "https://zgarma.ru", "http://dev.zgarma.ru", "https://dev.zgarma.ru"], // Разрешаем запросы с этого домена
    credentials: true,           // Разрешаем передачу куков
    methods: "GET,POST,PUT,DELETE,PATCH", // Разрешённые методы
    allowedHeaders: "*", // Разрешённые заголовки
}));
app.use(fileUpload())

const startServer = async () => {
    try {
        console.log("⏳ Ожидание создания всех таблиц...");

        // Ждем, пока все таблицы создадутся
        await sequelize.sync({ alter: true });

        console.log("✅ Все таблицы созданы!");

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

    } catch (error) {
        console.error("❌ Ошибка при создании таблиц:", error);
    }
};

startServer(); // Запускаем сервер только после успешного создания БД

