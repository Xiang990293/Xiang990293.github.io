// 初始化Blockly工作區
const workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});

// 導出Minecraft命令
document.getElementById('exportBtn').addEventListener('click', function() {
  const code = generateMinecraftCommand(workspace);
  // 將代碼轉換為文件並下載
  const blob = new Blob([code], {type: 'text/plain'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'minecraft_command.mcfunction';
  link.click();
});

// 自定義函數，將Blockly代碼轉換為Minecraft命令
function generateMinecraftCommand(workspace) {
  // 這裡實現你的邏輯，將Blockly代碼轉換為Minecraft命令
  // ...
  return 'your_minecraft_command_here';
}