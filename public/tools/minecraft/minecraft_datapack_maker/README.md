# This is the document especially for Blockly For Minecraft Project

NOTICE: Although this is a sub-project of Xiang990293.github.io, the versioning is apart from it, please keep it in mind.

## 1. Block Definitions

Blocks needs to be define at `./minecraft_datapack_maker/Blocks`.

### a. Command type Block definitions

Command need to be able to applied on both the statement of datapack and the value of execute subcommand.

Enable to make a block with both previousStatement, nextStatement and Output, it can't be done with JSON format definition. You can approach with JavaScript definition mensioned below:

```javascript
Blockly.Blocks["<command_id>"] = {
	init: function () {
		const Block = this;                    // This is the constant for only pass the block reference into lambda expression.
		this.setColour(HUE_COMMAND);           // please use this colo"u"r constant for only Command type Blocks.
		this.setPreviousStatement(true, null); // Enable to connect the previous statement in datapack format
		this.setNextStatement(true, null);     // Enable to connect the next statement in datapack format
		this.setOutput(true, "Subcommand");    // Enable to connect to the execute command in datapack format
	}
}
```

### b. Validation on specific block type

To simplifiying the project, we highly recommand to make a block especially for validating inputs instead for add a text field on different blocks and make multiple validator in each.

This is the validator for checking if player is inputting player id or UUID instead:

```javascript
Blockly.Blocks["entity_input"] = {
	init: function () {
		this.jsonInit({
			"output": ["Entity", "Player"],
			"colour": HUE_ENTITY_SELECTOR,
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
```

Notice that you also able to reuse that validator at different place, but we highly recommand you to make a **value block** for only validation a specific type of value input, aspecially for raw input from datapack maker.

### c. JSON format definition

Although we recommand defining a block with JavaScript format, but we also welcome the simple statement or input with json format for simplification.

```json
Blockly.defineBlocksWithJsonArray([
	{
		"type": "player_selector",
		"message0": "%1",
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
			}
		],
		"output": "Player",
		"colour": HUE_ENTITY_SELECTOR,
		"tooltip": "玩家選擇器",
		"helpUrl": ""
	},
	{
		"type": "entity_selector",
		"message0": "%1",
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
			}
		],
		"output": "Entity",
		"colour": HUE_ENTITY_SELECTOR,
		"tooltip": "實體選擇器",
		"helpUrl": ""
	}
]);
```

The format just like the Text component we familier with in minecraft datapack, but instead of `text`, we use `message0` for labeling blocks, instead of using `with` keywords to put fields or input replace in `%d`, we use `args0`.

Notice that you need to do this also in `.js` file instead of `.json` file, to maintaining the genre of blocks, we highly recommand put same type output or same usage blocks in same `.js` file.

### d. matation blocks

To use mutation Blocks, please ensure your requirement deos not met or against following rules.

```js
Blockly.Blocks["Example_if"] = {
        init: function () {
                // ...
        }
	// These are the serialization hooks for the target_selector block.
	saveExtraState: function () {
		return {
			'advancements': this.advancements_,
			'distance': this.distance_,
			'dx': this.dx_,
			'dy': this.dy_,
			'dz': this.dz_,
			'gamemode': this.gamemode_,
			'level': this.level_,
			'limit': this.limit_,
			'name': this.name_,
			'nbt': this.nbt_,
			'predicate': this.predicate_,
			'scores': this.scores_,
			'tag': this.tag_,
			'team': this.team_,
			'type': this.type_,
			'x': this.x_,
			'y': this.y_,
			'z': this.z_,
			'x_rotation': this.x_rotation_,
			'y_rotation': this.y_rotation_
		};
	},


	loadExtraState: function (state) {
		this.advancements_ = state['advancements'];
		this.distance_ = state['distance'];
		this.dx_ = state['dx'];
		this.dy_ = state['dy'];
		this.dz_ = state['dz'];
		this.gamemode_ = state['gamemode'];
		this.level_ = state['level'];
		this.limit_ = state['limit'];
		this.name_ = state['name'];
		this.nbt_ = state['nbt'];
		this.predicate_ = state['predicate'];
		this.scores_ = state['scores'];
		this.tag_ = state['tag'];
		this.team_ = state['team'];
		this.type_ = state['type'];
		this.x_ = state['x'];
		this.y_ = state['y'];
		this.z_ = state['z'];
		this.x_rotation_ = state['x_rotation'];
		this.y_rotation_ = state['y_rotation'];
		// This is a helper function which adds or removes inputs from the block.
	},

	// These are the decompose and compose functions for the target_selector block.
	decompose: function (workspace) {
		// This is a special sub-block that only gets created in the mutator UI.
		// It acts as our "top block"
		var topBlock = workspace.newBlock('target_selector_container');
		topBlock.initSvg();

		// Then we add one sub-block for each item in the list.
		var connection = topBlock.getInput('STACK').connection;
		options.forEach(option => {
			var itemBlock = workspace.newBlock('target_selector_' + option);
			itemBlock.initSvg();
			connection.connect(itemBlock.previousConnection);
			connection = itemBlock.nextConnection;
		});

		// And finally we have to return the top-block.
		return topBlock;
	},

	// The container block is the top-block returned by decompose.
	compose: function (topBlock) {
		// First we get the first sub-block (which represents an input on our main block).
		var itemBlock = topBlock.getInputTargetBlock('STACK');

		// Then we collect up all of the connections of on our main block that are
		// referenced by our sub-blocks.
		// This relates to the saveConnections hook (explained below).
		var connections = [];
		while (itemBlock && !itemBlock.isInsertionMarker()) {  // Ignore insertion markers!
			connections.push(itemBlock.valueConnection_);
			itemBlock = itemBlock.nextConnection &&
				itemBlock.nextConnection.targetBlock();
		}

		// Then we disconnect any children where the sub-block associated with that
		// child has been deleted/removed from the stack.
		this.options.forEach(option => {
			var connection = this.getInput('ADD' + option).connection.targetConnection;
			if (connection && connections.indexOf(connection) == -1) {
				connection.disconnect();
			}
		});

		// Then we update the shape of our block (removing or adding iputs as necessary).
		// `this` refers to the main block.
		this.updateShape_();


		for (var i = 0; i < options.length; i++) {
			connections[i].reconnect(this, 'ADD' + options[i]);
		}
	},

	saveConnections: function (topBlock) {
		// First we get the first sub-block (which represents an input on our main block).
		var itemBlock = topBlock.getInputTargetBlock('STACK');

		// Then we go through and assign references to connections on our main block
		// (input.connection.targetConnection) to properties on our sub blocks
		// (itemBlock.valueConnection_).
		var i = 0;
		while (itemBlock) {
			// `this` refers to the main block (which is being "mutated").
			var input = this.getInput('ADD' + this.options[i]);
			// This is the important line of this function!
			itemBlock.valueConnection_ = input && input.connection.targetConnection;
			i++;
			itemBlock = itemBlock.nextConnection &&
				itemBlock.nextConnection.targetBlock();
		}
	},
}
```


## 2. Field Definitions

Fields needs to be define at  `./minecraft_datapack_maker/Fields`, While Fields key needs to be registery first, Please register them in `./minecraft_datapack_maker/Fields/registry.js`.

## 3. Workspace and Toolbox categories
