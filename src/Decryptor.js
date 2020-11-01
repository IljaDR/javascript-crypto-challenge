const nacl = require('libsodium-wrappers');

module.exports = async(key) => {
    await nacl.ready;

    if(key == null){
        throw 'no key';
    }

    return Object.freeze({
        decrypt: (ciphertext, nonce) => {
            if(ciphertext == null || nonce == null){
                throw "Both a valid ciphertext and a nonce are required"
            }
            return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key)

        }
    });
}