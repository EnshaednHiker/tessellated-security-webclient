import jwt from "jsonwebtoken";

export default function (decryptedToken) {
    //function returns true if the token is not expired
    if (decryptedToken.exp - (Date.now()/1000) > 0){
        return true
    }
    else {
        return false
    }
}