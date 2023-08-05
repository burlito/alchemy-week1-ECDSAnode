const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { Blockchain, Block }    = require("./Blockchain.js")
const { hexToBytes, toHex } = require("ethereum-cryptography/utils.js")
const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { hashForSign, hexToSignature, getAddress } = require("./utils.js")

app.use(cors());
app.use(express.json());

transactionChain = new Blockchain("")

const balances = {
    "55919ebcb56e66832d849380890b8f2682b309bf": 100, // private key: 7d92231dcf28c115322518da4f8e486566ec069874faa07026041e2f776901a8
    "77c11e135ca3bb3f9e01de14a813ef47388887ef": 50, // private key: d1cb0f8673dfe70262160f5dd619178eb29674f905212066bf250754dff15226
    "37ca9c60ff02f1fed880a05d18e0d2151b5f7003": 75, // private key: 452d0a8688b99f31796f3cc6f55c2aaa7b7700cc61046215c6af1f56a06d2c3e
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.get('/top_hash', (req, res) => {
        const topHash = toHex(transactionChain.getTopHash())
        res.send({topHash})
});

//app.post("/send", (req, res) => {
//    const { sender, recipient, amount } = req.body;
//    setInitialBalance(sender);
//    setInitialBalance(recipient);
//
//    if (balances[sender] < amount) {
//        res.status(400).send({ message: "Not enough funds!" });
//    } else {
//        balances[sender] -= amount;
//        balances[recipient] += amount;
//        res.send({ balance: balances[sender] });
//    }
//});

app.post("/signed_send", (req, res) => {
    ['message', 'signature'].forEach(item => {
        if (! req.body.hasOwnProperty(item)) {
            res.status(400).send({ message: "request doesn't contain " + item });
            return;
        }
    })

    if (! req.body.hasOwnProperty('signature')) {
        res.status(400).send({ message: "request doesn't contain signature" });
        return;
    }

    const message = JSON.parse(req.body['message']);
    ['action', 'recipient', 'amount', 'top_hash'].forEach(item => {
        if (! message.hasOwnProperty(item)) {
            res.status(400).send({ message: "message doesn't contain " + item });
            return;
        }
    });

    if (message.action != "send") {
        res.status(400).send({ message: "Unsupported message action: " + message.action });
        return;
    }

    const message_hash = hashForSign(req.body['message']);
    const signature = hexToSignature(req.body['signature']);
    const point = signature.recoverPublicKey(message_hash);
    const pub_key = point.toHex(false);
    const address_bytes = getAddress(hexToBytes(pub_key));
    // at this point we assume message is authentificated

    const sender = toHex(address_bytes);
    const recipient = message.recipient;
    const amount = message.amount;
    const top_hash = message.top_hash;

    setInitialBalance(sender);

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
