// DEPENDENCIES
import express from 'express'

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

// CONFIG
const app = express()
sequelize.sync()

app.listen(3000, () => {
    console.log('\x1b[34mAPI STARTED\x1b[0m')
})

