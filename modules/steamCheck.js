import ACCOUNTS_TAB from '../database/accounts.js'
import GetDateInfo from './dateInfo.js'

const SteamCheck = async(req, res, next) => {
    try {
        const data = req.body

        if(!data.key) {
            console.log(`[${GetDateInfo.all}] MIDDLEWARE steamCheck прерван при выполнении запроса ${req.url}. Ключ пользователя не указан`)
            return res.json({status: 400, err: 'Account key is expected'})
        }

        const foundAccount = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAccount) {
            console.log(`[${GetDateInfo.all}] MIDDLEWARE steamCheck прерван при выполнении запроса ${req.url}. Пользователь не найден`)
            return res.json({ status: 404, err: 'Account key is undefined' })
        }
        if(!foundAccount.steam) {
            console.log(`[${GetDateInfo.all}] MIDDLEWARE steamCheck прерван при выполнении запроса ${req.url}. Аккаунт стим отсутствует `)
            return res.json({ status: 404, err: 'Steam account is expected' })
        }

        next()
        
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo.all}] Api developer error: Steam check error - ${e} \x1b[0m`);
        return res.json({
            status: 500,
            err: `Api developer error: Steam check error - ${e}`
        });
    }
}

export default SteamCheck;