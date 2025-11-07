const HUE_ENTITY = 230;

// Block definitions


Blockly.defineBlocksWithJsonArray([
	{
		"type": "player_selector",
		"message0": "%1 %2",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "Player_Name",
				"options": [
					["@p (最近的玩家)", "@p"],
					["@r (隨機的玩家)", "@r"],
					["@a (所有玩家)", "@a"],
					["@s (指令執行者)", "@s"]
				]
			},
			{
				"type": "input_value",
				"name": "target_selector",
				"check": "TargetSelector"
			}
		],
		"output": "Player",
		"input": ["TargetSelectorSingle", "TargetSelectorPlayer"],
		"colour": HUE_ENTITY,
		"tooltip": "玩家選擇器",
		"helpUrl": ""
	},
	{
		"type": "entity_selector",
		"message0": "%1 %2",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "Entity_Name",
				"options": [
					["@p (最近的玩家)", "@p"],
					["@r (隨機的玩家)", "@r"],
					["@a (所有玩家)", "@a"],
					["@s (指令執行實體)", "@s"],
					["@e (所有實體)", "@e"],
					["@n (離指令執行位置最近實體)", "@n"]
				]
			},
			{
				"type": "input_value",
				"name": "target_selector",
				"check": "TargetSelector"
			}
		],
		"output": "Entity",
		"input": ["TargetSelector", "TargetSelectorSingle", "TargetSelectorPlayer"],
		"colour": HUE_ENTITY,
		"tooltip": "實體選擇器",
		"helpUrl": ""
	}
]);

Blockly.Blocks["entity_input"] = {
	init: function () {
		this.jsonInit({
			"output": ["Entity", "Player"],
			"colour": HUE_ENTITY,
			"tooltip": "實體名稱 或 UUID",
			"helpUrl": ""
		}
		);

		this.appendDummyInput()
			.appendField(new Blockly.FieldTextInput("Steve", this.validate));
	},

	validate: (newVal) => {
		if (newVal.length <= 16) { // must be player name
			return newVal.replace(/[^a-zA-Z0-9_]/g, '');
		}

		if (newVal === '') {
			return null;
		}

		if (newVal.length > 36) { // must be UUID
			newVal = newVal.substring(0, 36);
		}

		if (newVal.length === 32) { // must be UUID
			newVal = newVal.substring(0, 8) + '-' +
				newVal.substring(8, 12) + '-' +
				newVal.substring(12, 16) + '-' +
				newVal.substring(16, 20) + '-' +
				newVal.substring(20, 32);
		}

		if (newVal.length === 36) if (newVal[8] !== '-' || newVal[13] !== '-' || newVal[18] !== '-' || newVal[23] !== '-') {
			newVal = newVal.substring(0, 8) + '-' +
				newVal.substring(9, 13) + '-' +
				newVal.substring(14, 18) + '-' +
				newVal.substring(19, 23) + '-' +
				newVal.substring(24, 36);
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

Blockly.defineBlocksWithJsonArray([{
	"type": "target_selector_container",
	"tooltip": "",
	"helpUrl": "",
	"message0": "目標選擇器參數 [ %1 %2 ] %3",
	"args0": [
		{
			"type": "input_dummy",
			"name": "NAME"
		},
		{
			"type": "input_statement",
			"name": "contents",
			"check": "TargetSelector"
		},
		{
			"type": "input_dummy",
			"name": "NAME"
		}
	],
	"output": "TargetSelector",
	"colour": HUE_ENTITY
}]);



Blockly.Blocks["target_selector_args"] = {
	init: function () {
		this.jsonInit({
			"colour": HUE_ENTITY,
			"tooltip": "目標選擇器參數",
			"helpUrl": "https://zh.minecraft.wiki/w/%E7%9B%AE%E6%A0%87%E9%80%89%E6%8B%A9%E5%99%A8?variant=zh-tw"
		});

		this.options = [
			"advancements",
			"distance",
			"dx",
			"dy",
			"dz",
			"gamemode",
			"level",
			"limit",
			"name",
			"nbt",
			"predicate",
			"scores",
			"tag",
			"team",
			"type",
			"x",
			"y",
			"z",
			"x_rotation",
			"y_rotation",
		]

		this.options2typeCheckMap = {
			"advancements": "AdvancementPredicate",
			"distance": "NoneNegativeNumberRange",
			"dx": "Double",
			"dy": "Double",
			"dz": "Double",
			"gamemode": "Gamemode",
			"level": "NumberRange",
			"limit": "Number",
			"name": "String",
			"nbt": "NbtCompound",
			"predicate": "EntityPredicate",
			"scores": "ScoreMap",
			"tag": "String",
			"team": "String",
			"type": "EntityType",
			"x": "Double",
			"y": "Double",
			"z": "Double",
			"x_rotation": "NumberRange",
			"y_rotation": "NumberRange",
		}

		// this.setMutator(new Blockly.icons.MutatorIcon(TargetSelectorMutationBlocks, this));

    	// this.setInputsInline(true)
		this.setNextStatement(true, ["TargetSelector"]);
		this.setPreviousStatement(true, ["TargetSelector"]);
		this.appendValueInput("selector_value").setCheck(this.options2typeCheckMap["advancement"])
			.appendField(new Blockly.FieldDropdown(transposeMatrix([this.options, this.options]), this.validate), "selector_name")
			.appendField("=")
	},
                    
	validate: function (newVal) {
		const block = this.getSourceBlock();
		const typeCheck = block.options2typeCheckMap[newVal];
		block.getInput("selector_value").setCheck(typeCheck);
		return newVal;
	}
}