// this registry is not nessesary for Blocks.
// it is for mutators registry

// Function signature.
// Blockly.Extensions.registerMutator(mixinObj, opt_helperFn, opt_blockList);

// Example call.
// Blockly.Extensions.registerMutator(
// 	"target_selector_mutator",
// 	{
// 		loadExtraState: Blockly.Blocks['target_selector'].loadExtraState,
// 		saveExtraState: Blockly.Blocks['target_selector'].saveExtraState
// 	},
// 	undefined,
// 	TargetSelectorMutationBlocks
// );