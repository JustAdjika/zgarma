import ADMINS_TAB from "../database/adminList.js";

const PermissionsCheck = async(req, res, next) => {
    try {
        const data = req.body

        const foundAdministrator = await ADMINS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!foundAdministrator) {
            return res.json({
                status: 403,
                err: 'Not enough permits'
            })
        }

        next()
        
    } catch (e) {
        console.error(`\x1b[31mApi developer error: Permissions error - ${e} \x1b[0m`);
        return res.json({
            status: 500,
            err: `Api developer error: Permissions error - ${e}`
        });
    }
}

export default PermissionsCheck;