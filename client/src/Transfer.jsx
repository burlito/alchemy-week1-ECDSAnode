import { useState } from "react";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js"
import { prepend_0x, strip_0x } from './utils'
import server from "./server";

async function get_wallet_permission(address, eth = window.ethereum) {
	const wallet = prepend_0x(address)

	var eth_accounts = [];
	for (var i = 0 ; i < 4; i++) { // 4 attempts
		try {
			eth_accounts = await eth.request({
				"method": "eth_accounts"
			});
		} catch (e) {
			console.dir(e);
		}

		if (eth_accounts.includes(wallet)) {
			return true;
		}
		
		try {
			const perm_request = await eth.request({
				"method": "wallet_requestPermissions",
				"params": [{
					"eth_accounts": { 
						"requiredMethods" : ['personal_sign']
					}
				}]
			});
		} catch (e) {
			if (e.code == 4001) {
				alert("you must choose wallet which can sign transaction");
				return false;
			}
		}
	}
	try {
		eth_accounts = await eth.request({
			"method": "eth_accounts"
		});
	} catch (e) {
		console.dir(e);
	}

	if (eth_accounts.includes(wallet)) {
		return true;
	}

	return false;
}

function Transfer({ address, setBalance }) {
	const [sendAmount, setSendAmount] = useState("");
	const [recipient, setRecipient] = useState("");

	const setValue = (setter) => (evt) => setter(evt.target.value);




	async function transfer(evt) {
		evt.preventDefault();
		const top_hash_resp = await server.get(`top_hash`);
		const top_hash = top_hash_resp.data;
		const message = {
			"action": "send",
			"recipient": strip_0x(recipient),
			"amount": Number(sendAmount),
			"top_hash": top_hash
		};
		const message_str = JSON.stringify(message, null, '\t');
		const message_hex = toHex(utf8ToBytes(message_str))
		const have_sign_rights = await get_wallet_permission(address);

		if (! have_sign_rights) {
			alert("Don't have signing rights for wallet");
			return false;
		}

		var signature = ""
		try {
			signature = await window.ethereum.request({
				"method": 'personal_sign', 
				"params": [ prepend_0x(message_hex) , prepend_0x(address) ]
			})
		} catch {
			alert("Wasn't able to sign message");
			return false;
		}

		const payload = {
			"message": message_str,
			"signature": signature
		}
		try {
			const { data: {balance} } = await server.post(`signed_send`, payload)
			setBalance(balance);
		} catch (e) {
			alert(e.response.data.message);
		}

		return true;
	}

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder="1, 2, 3..."
					value={sendAmount}
					onChange={setValue(setSendAmount)}
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type an address, for example: 0x2"
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<input type="submit" className="button" value="Transfer" />
		</form>
	);
}

export default Transfer;
