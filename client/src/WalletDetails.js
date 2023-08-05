import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex } from "ethereum-cryptography/utils";

class WalletDetails {
	constructor(private_key, initial_ballance = 0) {
		this.private_key = private_key;
		this.ballance = initial_ballance
	}

	get_address() {
		const public_key = secp256k1.getPublicKey(this.private_key, false)
		return toHex(keccak256(public_key.slice(1)).slice(-20))
	}

	get_balance() {
		return this.ballance
	}

	get_private_key() {
		return this.private_key;
	}

	get_public_key() {
		return toHex(secp256k1.getPublicKey(this.private_key, false))
	}
}

export default WalletDetails;
