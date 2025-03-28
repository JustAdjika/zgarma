import ACCOUNTS_TAB from '../database/accounts.js'

const SteamCheck = async(req, res, next) => {
    try {
        const data = req.body

        if(!data.key) return res.json({status: 400, err: 'Account key is expected'})

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAccount) return res.json({ status: 404, err: 'Account key is undefined' })
        if(!foundAccount.steam) return res.json({ status: 404, err: 'Steam account is expected' })

        next()
        
    } catch (e) {
        console.error(`\x1b[31mApi developer error: Steam check error - ${e} \x1b[0m`);
        return res.json({
            status: 500,
            err: `Api developer error: Steam check error - ${e}`
        });
    }
}

export default SteamCheck;