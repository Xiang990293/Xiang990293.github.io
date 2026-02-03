// command definition
const HUE_COMMAND = 308;

Blockly.Blocks["advancement"] = {
	init: function () {
		const Block = this;
		this.setColour(HUE_COMMAND);
		this.appendDummyInput()
			.appendField(new Blockly.FieldLabelSerializable("advancement"), "advancement")
			.appendField(new Blockly.FieldDropdown([["grant", "grant"], ["revoke", "revoke"]]), "advancement_subcommand");
		this.appendValueInput("player_selector").setCheck("Player");
		this.appendDummyInput("main_input")
			.appendField(new Blockly.FieldDropdown([
				["everything", "everything"],
				["from", "from"],
				["only", "only"],
				["through", "through"],
				["until", "until"]
			], this.validate), "test")

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setOutput(true, "Subcommand");
	},

	validate: function (newVal) {
		const block = this.getSourceBlock();

		if (newVal !== "everything") {
			if (!block.getField("advancement_id")) {
				block.getInput("main_input").appendField(new Blockly.FieldTextInput("minecraft:story/root"), "advancement_id");
			}
		} else {
			block.getInput("main_input").removeField("advancement_id", true);
		}
		return newVal;
	}
}

Blockly.Blocks["attribute"] = {
	init: function () {
		const Block = this;
		this.setColour(HUE_COMMAND);
		this.appendDummyInput()
			.appendField(new Blockly.FieldLabelSerializable("attribute"), "attribute")
		this.appendValueInput("player_selector").setCheck("Player");
		this.appendDummyInput("main_input")
			.appendField(new Blockly.FieldDropdown(transposeMatrix([attribute_id, attribute_id]), this.validate), "test")

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setOutput(true, "Subcommand");
	},

	validate: function (newVal) {
		const block = this.getSourceBlock();

		if (newVal !== "") {
		} else {
		}
		return newVal;
	}
}

Blockly.Blocks["ban"] = {
	init: function () {
		const Block = this;
		this.setColour(HUE_COMMAND);
		this.appendDummyInput()
			.appendField(new Blockly.FieldLabelSerializable("ban"), "ban")
		this.appendValueInput("player_selector").setCheck("Player");
		this.appendDummyInput("main_input")
			.appendField(new Blockly.FieldTextInput(""), "ban_reason")

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setOutput(true, "Subcommand");
	}
}

Blockly.Blocks["ban-ip"] = {
	init: function () {
		const Block = this;
		this.setColour(HUE_COMMAND);
		this.appendDummyInput()
			.appendField(new Blockly.FieldLabelSerializable("ban"), "ban")
			.appendField(new Blockly.FieldTextInput("0.0.0.0", this.validate), "ban_ip")
			.appendField(new Blockly.FieldTextInput(""), "ban_reason")

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setOutput(true, "Subcommand");
	},

	validate: function (newVal) {
		const block = this.getSourceBlock();

		if (newVal !== "") {
		} else {
		}
		return newVal;
	}
}

Blockly.Blocks["banlist"] = {
	init: function () {
		const Block = this;
		this.setColour(HUE_COMMAND);
		this.appendDummyInput()
			.appendField(new Blockly.FieldLabelSerializable("banlist"), "banlist")
			.appendField(new Blockly.FieldDropdown([["ips","ips"],["players","players"]]), "banlist_type")

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setOutput(true, "Subcommand");
	},

	validate: function (newVal) {
		const block = this.getSourceBlock();

		if (newVal !== "") {
		} else {
		}
		return newVal;
	}
}

Blockly.Blocks["bossbar"] = {
	init: function () {
		const Block = this;
		this.setColour(HUE_COMMAND);
		this.appendDummyInput()
			.appendField(new Blockly.FieldsDropdown([["add","add"],["get","get"],["list","list"],["remove","remove"],["set","set"]]), "bossbar_subcommand")
			.appendField(new Blockly.FieldTextInput("mybar"), "bossbar_id")
			.appendField(new Blockly.FieldTextInput("mybar"), "bossbar_id")

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setOutput(true, "Subcommand");
	},

	validate: function (newVal) {
		const block = this.getSourceBlock();

		if (newVal !== "") {
		} else {
		}
		return newVal;
	}
}

// define with JSON is not recommanded for complex Command type Blocks
Blockly.defineBlocksWithJsonArray([
	{   // advancement command
		"type": "minecraft_command_template",
		"message0": "advancement %1 %2 %3 ",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "advancement_subcommand",
				"options": [
					["grant", "grant"],
					["revoke", "revoke"]
				]
			},
			{
				"type": "input_value",
				"name": "player_selector",
				"check": "Player"
			},
			{
				"type": "field_dropdown",
				"name": "advancement_subcommand",
				"options": [
					["everything", "everything"],
					["from", "from"],
					["only", "only"],
					["through", "through"],
					["until", "until"]
				]
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		"input": "advancement_key",
		"colour": HUE_COMMAND,
		"tooltip": "進度指令",
		"helpUrl": ""
	}
]);