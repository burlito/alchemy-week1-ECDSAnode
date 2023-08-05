const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils.js")

function stripHexPrefix(str) {
    if (str.startsWith("0x")) {
        return str.slice(2);
    } else {
        return str;
    }
}

function stripHexPrefix(str) {
    if (str.startsWith("0x")) {
        return str.slice(2);
    } else {
        return str;
    }
}

function getAddress(publicKey) {
    return keccak256(publicKey.slice(1)).slice(-20);
}

function bigIntToHex(bigInt) {
    return bigInt.toString(16);
}

function signatureToHex(signature) {
    return signature.r.toString(16) + signature.s.toString(16) + signature.recovery.toString(16)
}

function hexToSignature(hex_signature) {
    const h_signature = stripHexPrefix(hex_signature);
    const r = BigInt('0x' + h_signature.slice(0, 64))
    const s = BigInt('0x' + h_signature.slice(64, 128))
    const recovery = parseInt(h_signature.slice(128), 16)

    return new secp256k1.Signature(r, s, 1);
    //return secp256k1.Signature.fromCompact(h_signature)
}

function hashForSign(message) {
    return keccak256(utf8ToBytes("\x19Ethereum Signed Message:\n" + message.length +  message));
}

module.exports = {
    getAddress,
    bigIntToHex,
    signatureToHex,
    hexToSignature,
    hashForSign
}
