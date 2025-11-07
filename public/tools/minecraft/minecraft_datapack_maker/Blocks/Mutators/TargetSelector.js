// TargetSelectorMutationBlocks = []
// OPTIONS.forEach(option => {
// 	TargetSelectorMutationBlocks.push("target_selector_"+option)
// 	Blockly.defineBlocksWithJsonArray([
// 		{
// 			"type": "target_selector_"+option,
// 			"message0": option,
// 			"output": "TargetSelector", //+option.charAt(0).toUpperCase() + option.slice(1),
// 			"colour": HUE_ENTITY,
// 			"tooltip": "目標選擇器 - "+option,
// 			"helpUrl": ""
// 		}
// 	]);
// })

// Blockly.Blocks["target_selector_container"] = {
// 	init: function () {
// 		this.jsonInit({
// 			"input": "TargetSelector",
// 			"colour": HUE_ENTITY,
// 			"tooltip": "目標選擇器參數",
// 			"helpUrl": ""
// 		});	
// 	}
// }