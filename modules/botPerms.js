const botKey = process.env.BOT_ACCESS_KEY
import GetDateInfo from './dateInfo.js'

const BotPermissionsCheck = async(req, res, next) => {
    try {
        const data = req.body

        if(data.botKey != botKey) {
            console.log(`[${GetDateInfo.all}] MIDDLEWARE botPerms прерван при выполнении запроса ${req.url}. Ключ доступа бота не совпадает с указанным`)
            return res.json({
                status: 403,
                err: 'ACCESS DENIED. BOT KEY IS NOT SUITABLE'
            })
        }

        next()
        
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo.all}] Api developer error: BotPerms error - ${e} \x1b[0m`);
        return res.json({
            status: 500,
            err: `Api developer error: BotPerms error - ${e}`
        });
    }
}

export default BotPermissionsCheck;