var isRun=false;
function debug(){
    if(isRun!=true){
        isRun=false;
        document.getElementById("execute_button").style.color="red";
        document.getElementById("command_result").value = __interger_limit;
        isRun=true;
        setTimeout(debug, 1000);
    }else{
        document.getElementById("execute_button").style.color="black";
        isRun=false;
    }
}

function command(executer, position, command_text){
    var world_height_limit=319;
    var world_bottom_limit=-64;

    const __defult_gamerule_value = [0,0,0,1,1,1,1,0,1,100,10,1,0,1,24,1,01,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,65536,0];
    const __gamerule_type=["disableElytraMovementCheck","doImmediateRespawn","doLimitedCrafting","drowningDamage","fallDamage","fireDamage","freezeDamage","keepInventory","naturalRegenration","playersSleepingPercentage","spawnRadius","spectatorsGenerateChunks","disableRaids","forgiveDeadPlayers","maxEntityCramming","mobGriefing","univarsalAnger","doInsomnia","doMobSpawning","doPatrolSpawning","doTraderSpawning","doWardenSpawning","doEntityDrop","doMobLoot","doTileDrop","doDaylightCycle","doFireTick","doWeatherCycle","randomTickSpeed","announceAdvancements","commandBlockOutput","logAdminCommands","sendCommandFeedback","showDeathMessages","maxCommandChainLength","reducedDebugInfo"]
    var gamerule_value = __defult_gamerule_value;

    const __interger_limit = [-2147483648,2147483647];
    const __timer_limit = [0,1000000];

    if(command_text.indexOf(" ")+1){
        var command_type=command_text.substring(0,command_text.indexOf(" "));
    }else{
        var command_type=command_text.substring(0);
    }
    
    var input=command_text.replace(command_type,"").substring(1).split(" ");
    
    switch(command_type){
        case "say":{
            if(input[0]=="")
                return `未知或不完整的指令，錯誤如下\n${command_type}<--[這裡]`;
            else
                return "["+executer+"] "+input;
        }

        case "reload":{
            if(input[0]!="")
                return `指令的引數不正確\n${command_text}<--[這裡]`;
            else
                return "重新載入中！";
        }

        case "weather":{
            var output="";
            if(input[0]=="clear"){
                output = "晴朗";
            }else if(input[0]=="rain"){
                output = "降雨";
            }else if(input[0]=="thunder"){
                output = "雷雨";
            }else{
                return `指令的引數不正確\n${command_text}<--[這裡]`;
            }

            if(input[1]!=undefined){
                if(input[1]>=__interger_limit[0]&&input[1]<=__interger_limit[1]){
                    if(input[1]>=__timer_limit[0]&&input[1]<=__timer_limit[1]){
                        output += "";
                    }else if(input[1]<__timer_limit[0]){
                        return `整數不能少於 ${__timer_limit[0]}，但找到的是 ${input[1]}`;
                    }else if(input[1]>__timer_limit[1]){
                        return `整數不能多於 ${__timer_limit[1]}，但找到的是 ${input[1]}`;
                    }
                }else{
                    return `指令的引數不正確\n${command_text}<--[這裡]`;
                }
            }
            

            if(input.length>2){
                for(i=2;i<input.length;i++){
                    if(input[i]!=undefined){
                        return `指令的引數不正確\n${command_text}<--[這裡]`;
                    }
                }
            }

            return "天氣已設為" + output;
        }
    }

    return "未知或不完整的指令";
}

function execute(){
    var executer = document.getElementById("player_id").value;
    var position = [document.getElementById("position_x").value,document.getElementById("position_y").value,document.getElementById("position_z").value];
    var command_text = document.getElementById("command_text").value;

    if(command_text.startsWith("/")){
        command_text = command_text.substring(1);
    }

    document.getElementById("command_result").value = command(executer, position, command_text);
}