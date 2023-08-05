export function prepend_0x(address) {
	if (typeof address !== 'string') {
		throw new Error('Input must be a string!');
	}

	return address.startsWith('0x') ? address : '0x' + address;
}

export function strip_0x(address) {
	if (typeof address !== 'string') {
		throw new Error('Input must be a string!');
	}

	if (address.startsWith("0x")) {
		return address.slice(2);
	}

	return address;
}
