import ADMINS_TAB from "../database/adminList.js";
import GetDateInfo from './dateInfo.js'

const PermissionsCheck = async(req, res, next) => {
    try {
        const data = req.body

        const foundAdministrator = await ADMINS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAdministrator) {
            console.log(`[${GetDateInfo.all}] MIDDLEWARE PermissionsCheck прерван при выполнении запроса ${req.url}. Администиратор ${data.key} не найден в списке`)

            return res.json({
                status: 403,
                err: 'Not enough permits'
            })
        }

        next()
        
    } catch (e) {
        console.error(`\x1b[31m[${GetDateInfo.all}] Api developer error: Permissions error - ${e} \x1b[0m`);
        return res.json({
            status: 500,
            err: `Api developer error: Permissions error - ${e}`
        });
    }
}

export default PermissionsCheck;