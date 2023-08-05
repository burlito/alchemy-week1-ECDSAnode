const { sha256 } = require('ethereum-cryptography/sha256.js');
const { utf8ToBytes } = require('ethereum-cryptography/utils.js')

class Block {
    constructor(d) {
        this.data = d
    }

    toHash() {
        if (this.hasOwnProperty('previousHash')) {
            return sha256(utf8ToBytes(this.previousHash + this.data));
        }
        
        return sha256(utf8ToBytes(this.data));
    }
}

class Blockchain {
    constructor() {
        this.chain = [ new Block("") ];
    }

    addBlock(block) {
        const last = this.chain[this.chain.length - 1];
        block.previousHash = last.toHash()
        this.chain.push(block);
    }

    isValid() {
         for (let i = 1; i < this.chain.length; i++) {
             var prev = this.chain[i-1].toHash().toString();
             var current = this.chain[i].previousHash.toString();
             if (prev != current)
                return false;
         }

         return true;
    }

    getTopHash() {
        const last = this.chain[this.chain.length - 1];
        return last.toHash()
    }
}

module.exports = {
    Block,
    Blockchain
}
