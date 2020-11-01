const nacl = require('libsodium-wrappers');

module.exports = async(key) => {
    await nacl.ready;

    if(key == null){
        throw 'no key';
    }

    return Object.freeze({
        encrypt: (message, nonce) => {
            if(message == null || nonce == null ){
                throw "Both a valid message and a nonce are required"
            }
            return nacl.crypto_secretbox_easy(message, nonce, key)

        }
    });
}