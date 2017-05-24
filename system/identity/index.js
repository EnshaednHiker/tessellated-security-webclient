import * as security from '~/system/security'

export default function () {
    try {
        return security.decrypt(window.localStorage.getItem(process.env.TOKEN));
    }
    catch (err){
        
        console.warn("no valid identity found", err);
        return {}
    }
}