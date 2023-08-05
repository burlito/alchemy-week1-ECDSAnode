import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex } from "ethereum-cryptography/utils";
import WalletDetails from './WalletDetails'

function WalletList() {
	const wallets = [
		new WalletDetails('7d92231dcf28c115322518da4f8e486566ec069874faa07026041e2f776901a8', 100),
		new WalletDetails('d1cb0f8673dfe70262160f5dd619178eb29674f905212066bf250754dff15226', 50),
		new WalletDetails('452d0a8688b99f31796f3cc6f55c2aaa7b7700cc61046215c6af1f56a06d2c3e', 75)
	]

	return (
		<div className="container wallet-list">
		  <h1>List of embedded wallets</h1>
		<table>
		<thead>
		  <tr>
			<th>Address</th>
			<th>Private Key</th>
			<th>Initial Balance</th>
		  </tr>
		</thead>
		<tbody>
		{ wallets.map( wallet =>
			<tr key={wallet.get_address()}>
				<td>{wallet.get_address()}</td>
				<td>{wallet.get_private_key()}</td>
				<td>{wallet.get_balance()}</td>
			</tr>
		)}
		</tbody>
		</table>

		<p>Please add some of those wallets to your etherum client (should work with metamask)</p>
		</div>

	);
}

export default WalletList;
