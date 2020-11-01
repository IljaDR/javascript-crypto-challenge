const nacl = require('libsodium-wrappers');

module.exports = async() => {
    await nacl.ready
    const keypair = nacl.crypto_sign_keypair();

    return Object.freeze({
        verifyingKey: keypair.publicKey,

        sign: (message) => {
            return nacl.crypto_sign(message, keypair.privateKey)
        }

    })
}