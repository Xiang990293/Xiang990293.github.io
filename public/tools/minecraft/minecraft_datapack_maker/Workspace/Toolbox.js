const toolbox = {
	"kind": "categoryToolbox",
	"contents": [
		{
			"kind": "category",
			"name": "範例類別",
			"colour": "10", // HUE 顏色代碼
			"contents": [
				{
					"kind": "category",
					"name": "子類別",
					"colour": "20",
					"contents": [
						{
							"kind": "block",
							"type": "math_number"
						},
					]
				},
				{
					"kind": "block",
					"type": "controls_if"
				},
				{
					"kind": "block",
					"type": "logic_compare"
				},
				{
					"kind": "block",
					"type": "controls_if"
				},
				{
					"kind": "block",
					"type": "logic_compare"
				},
				{
					"kind": "block",
					"type": "math_number"
				},
				{
					"kind": "block",
					"type": "text"
				},
				{
					"kind": "block",
					"type": "text_print"
				}
			]
		},
		{
			"kind": "category",
			"name": "指令",
			"colour": HUE_COMMAND,
			"contents": [
				{
					"kind": "block",
					"type": "advancement"
				},
				{
					"kind": "block",
					"type": "attribute"
				},
				{
					"kind": "block",
					"type": "ban"
				},
				{
					"kind": "block",
					"type": "ban-ip"
				},
				{
					"kind": "block",
					"type": "banlist"
				},
				{
					"kind": "block",
					"type": "text_print"
				}
			]
		},
		{
			"kind": "category",
			"name": "實體",
			"colour": HUE_ENTITY,
			"contents": [
				{
					"kind": "category",
					"name": "目標選擇器",
					"colour": HUE_ENTITY,
					"contents": [
						{
							"kind": "block",
							"type": "player_selector"
						},
						{
							"kind": "block",
							"type": "entity_selector"
						},
						{
							"kind": "block",
							"type": "entity_input"
						},
						{
							"kind": "block",
							"type": "target_selector_args"
						},
						{
							"kind": "block",
							"type": "target_selector_container"
						},
					]
				},
				{
					"kind": "category",
					"name": "座標",
					"colour": HUE_ENTITY,
					"contents": [
						{
							"kind": "block",
							"type": "entity_input"
						}
					]
				}
			]
		}
	]
}