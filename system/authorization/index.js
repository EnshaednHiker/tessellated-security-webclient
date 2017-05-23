

export default function (decryptedToken) {
    if (decryptedToken.exp - (Date.now()/1000) <= 0){
        return true
    }
    else {
        return false
    }
}