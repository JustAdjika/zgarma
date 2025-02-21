// DEPENDENCIES
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'

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

// ROUTERS
import accountRouter from './routers/accountRouter.js'
import postRouter from './routers/postRouter.js'
import bodyParser from 'body-parser'
import bugfixRouter from './routers/bugfixRouter.js'
import bugticketRouter from './routers/bugticketRouter.js'
import eventRouter from './routers/eventRouter.js'
import eventEditRouter from './routers/eventEditRouter.js'
import eventSquadRouter from './routers/eventSquadRouter.js'
import eventVehRouter from './routers/eventVehRouter.js'
import eventRequestRouter from './routers/eventRequestRouter.js'

// CONFIG
const app = express()
app.use(bodyParser.json())
app.use(cors())
sequelize.sync()

app.use(fileUpload())

app.listen(3000, () => {
    console.log('\x1b[35m |!-------- API STARTED -------!| \x1b[0m')
})


// USE ROUTER
app.use('/api/developer/account', accountRouter)
app.use('/api/developer/post', postRouter)
app.use('/api/developer/bugfix/notes', bugfixRouter)
app.use('/api/developer/bugfix/tickets', bugticketRouter)
app.use('/api/developer/event', eventRouter)
app.use('/api/developer/event/edit', eventEditRouter)
app.use('/api/developer/event/edit/vehicle', eventVehRouter)
app.use('/api/developer/event/edit/squad', eventSquadRouter)
app.use('/api/developer/event/request', eventRequestRouter)