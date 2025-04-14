

/* <button class="導航欄-btn" onclick="window.location.href='./home.html';">首頁</button> */

function darkmode() {
	var element = document.body;
	element.classList.toggle("dark-mode");
 }

//current time
function ShowTime(){
    const d = new Date();

    function trans_num_to_ChineseDay(x){
        const word=["日","一","二","三","四","五","六"];
        return word[x];
    }

    function timefix(x){
        if (x<10){
            x = "0" + x;
        }
        return x;
    }

    document.getElementById('showtime').innerHTML = "⏰" + d.getFullYear() + "/" + timefix(d.getMonth()+1) + "/" + timefix(d.getDate()) + "(" + trans_num_to_ChineseDay(d.getDay()) + ") " + timefix(d.getHours()) + ":" + timefix(d.getMinutes()) + ":" + timefix(d.getSeconds()) + " (UTC+8)";
    setTimeout('ShowTime()',100);
}
var timer = document.getElementById("time");

