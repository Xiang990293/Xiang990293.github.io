Blockly.Blocks['custom_if'] = {
	init: function () {
		this.setMutator(new Blockly.icons.MutatorIcon(['custom_if_elseif', 'custom_if_else'], this));
		this.appendValueInput("IF0")
			.setCheck("Boolean")
			.appendField("如果");
		this.appendStatementInput("DO0")
			.appendField("那么");

		this.elseifCount_ = 0;
		this.elseCount_ = 0;

		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour("#1E90FF");
	},

	decompose: function (workspace) {
		const containerBlock = workspace.newBlock('custom_if_container');
		containerBlock.initSvg();

		let connection = containerBlock.getInput('STACK').connection;

		for (let i = 1; i <= this.elseifCount_; i++) {
			const elseifBlock = workspace.newBlock('custom_if_elseif');
			elseifBlock.initSvg();
			connection.connect(elseifBlock.previousConnection);
			connection = elseifBlock.nextConnection;
		}

		if (this.elseCount_) {
			const elseBlock = workspace.newBlock('custom_if_else');
			elseBlock.initSvg();
			connection.connect(elseBlock.previousConnection);
		}

		return containerBlock;
	},

	compose: function (containerBlock) {
		// 移除所有 elseif 和 else
		for (let i = 1; this.getInput(`IF${i}`); i++) {
			this.removeInput(`IF${i}`);
			this.removeInput(`DO${i}`);
		}
		if (this.getInput('ELSE')) {
			this.removeInput('ELSE');
		}

		this.elseifCount_ = 0;
		this.elseCount_ = 0;

		// 重新插入
		let clauseBlock = containerBlock.getInputTargetBlock('STACK');
		let i = 1;
		while (clauseBlock) {
			if (clauseBlock.type === 'custom_if_elseif') {
				this.appendValueInput(`IF${i}`)
					.setCheck("Boolean")
					.appendField("否则如果");
				this.appendStatementInput(`DO${i}`)
					.appendField("那么");
				i++;
				this.elseifCount_++;
			} else if (clauseBlock.type === 'custom_if_else') {
				this.appendStatementInput('ELSE')
					.appendField("否则");
				this.elseCount_++;
			}
			clauseBlock = clauseBlock.nextConnection || clauseBlock.nextConnection.targetBlock();
		}
	}
};
Blockly.Blocks['custom_if_container'] = {
	init: function () {
		this.appendDummyInput().appendField("条件分支");
		this.appendStatementInput("STACK");
		this.setColour(210);
		this.setTooltip("");
		this.contextMenu = false;
	}
};

Blockly.Blocks['custom_if_elseif'] = {
	init: function () {
		this.appendDummyInput().appendField("添加 否则如果");
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(210);
		this.setTooltip("");
		this.contextMenu = false;
	}
};

Blockly.Blocks['custom_if_else'] = {
	init: function () {
		this.appendDummyInput().appendField("添加 否则");
		this.setPreviousStatement(true, null);
		this.setColour(210);
		this.setTooltip("");
		this.contextMenu = false;
	}
};
javascriptGenerator.forBlock['custom_if'] = function (block, generator) {
	let code = '';
	let n = 0;

	const condition = generator.valueToCode(block, 'IF0', Order.NONE) || 'false';
	const branch = generator.statementToCode(block, 'DO0');
	code += `if (${condition}) {${branch}}`;

	for (n = 1; n <= block.elseifCount_; n++) {
		const condition = generator.valueToCode(block, 'IF' + n, Order.NONE) || 'false';
		const branch = generator.statementToCode(block, 'DO' + n);
		code += ` else if (${condition}) {${branch}}`;
	}

	if (block.elseCount_) {
		const branch = generator.statementToCode(block, 'ELSE');
		code += ` else {${branch}}`;
	}



	return code + '';
};