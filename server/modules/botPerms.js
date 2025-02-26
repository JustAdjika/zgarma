const botKey = process.env.BOT_ACCESS_KEY

const BotPermissionsCheck = async(req, res, next) => {
    try {
        const data = req.body

        if(data.botKey != botKey) {
            return res.json({
                status: 403,
                err: 'ACCESS DENIED. BOT KEY IS NOT SUITABLE'
            })
        }

        next()
        
    } catch (e) {
        console.error(`\x1b[31mApi developer error: BotPerms error - ${e} \x1b[0m`);
        return res.json({
            status: 500,
            err: `Api developer error: BotPerms error - ${e}`
        });
    }
}

export default BotPermissionsCheck;