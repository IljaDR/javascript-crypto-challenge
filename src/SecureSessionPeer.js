const nacl = require('libsodium-wrappers');
const Encryptor = require('./Encryptor');
const Decryptor = require('./Decryptor');

const secureSessionPeer = async(securePeer = null) => {
    await nacl.ready;

    const secureSessionPeer = {};
    const otherPeer = {};

    const { publicKey, privateKey } = nacl.crypto_box_keypair();
    secureSessionPeer.publicKey = publicKey,

    secureSessionPeer.connector = async function(otherPeer, keys) {
        this.otherPeer = otherPeer;

        let key = keys(publicKey, privateKey, otherPeer.publicKey);
        secureSessionPeer.decryptor = await Decryptor(key.sharedRx);
        secureSessionPeer.encryptor = await Encryptor(key.sharedTx);
    }

    if(securePeer != null){
        await secureSessionPeer.connector(securePeer, nacl.crypto_kx_client_session_keys);
        await securePeer.connector(secureSessionPeer, nacl.crypto_kx_server_session_keys);
    }

    secureSessionPeer.encrypt = function(msg) {
        const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
        const ciphertext = this.encryptor.encrypt(msg, nonce);
        return { nonce, ciphertext };
    }

    secureSessionPeer.decrypt = function(msg, nonce) {
        return secureSessionPeer.decryptor.decrypt(msg, nonce);
    }

    secureSessionPeer.send = function(msg){
        this.otherPeer.message = this.encrypt(msg);
    }

    secureSessionPeer.receive = function(){
        return this.decrypt(this.message.ciphertext, this.message.nonce)
    }

    return Object.defineProperties(secureSessionPeer, {
        publicKey: {writable: false},
        privateKey: {writable: false}
    });
}

module.exports = secureSessionPeer;