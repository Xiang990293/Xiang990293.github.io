class EntityInput extends Blockly.FieldTextInput {
	constructor(value, validator, options) {
		super(value, validator, options);

		this.validator = EntityInput.validator;
	}

	static fromJson(options) {
		const value = Blockly.utils.parsing.replaceMessageReferences(options.value);
		return new EntityInput(value);
	}

	static validator(newVal) {
		if (newVal.length <= 16) { // must be player name
			return newVal.replace(/[^a-zA-Z0-9_]/g, '');
		}

		if (newVal === '') {
			return null;
		}

		if (newVal.length > 36) { // must be UUID
			return newVal.substring(0, 36);
		}

		if (newVal.length === 32) { // must be UUID
			return newVal.substring(0, 8) + '-' +
				newVal.substring(8, 12) + '-' +
				newVal.substring(12, 16) + '-' +
				newVal.substring(16, 20) + '-' +
				newVal.substring(20, 32);
		}

		if (newVal[8] !== '-' || newVal[13] !== '-' || newVal[18] !== '-' || newVal[23] !== '-') {
			newVal[8] = '-';
			newVal[13] = '-';
			newVal[18] = '-';
			newVal[23] = '-';
		}

		newVal = newVal.toLowerCase();
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
		if (uuidRegex.test(newVal)) {
			return newVal;
		} else {
			return newVal.replace(/[^0-9a-f-]/g, '0');
		}
	}
}