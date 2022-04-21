var headerPage = document.getElementById("headerPage");
headerPage.innerHTML = `
<div id="head">
    <button id="showbox"></button>
    <div class="頁首">
        <h1 class="big-title">麥快研究團隊</h1>
        <h2 id="subtitle" class="big-title"></h2>
    </div>
    <div class="導航欄">
        <button class="導航欄-btn" onclick="window.location.href='home.html';">首頁</button>
        <button class="導航欄-btn" onclick="window.location.href='team_intro.html';">關於團隊</button>
        <button class="導航欄-btn" onclick="window.location.href='mini_game.html';">小遊戲</button>
        <button class="導航欄-btn" onclick="window.location.href='team_history.html';">團隊歷史</button>
        <button class="導航欄-btn" onclick="window.location.href='tools.html';">工具</button>
        <button class="導航欄-btn" onclick="window.location.href='mini_game.html';">小遊戲</button>
        <button class="導航欄-btn" onclick="window.location.href='contect_to_us.html';">聯絡我們</button>
    </div>
</div>
`;



var siderPage = document.getElementById("siderPage");
siderPage.innerHTML = `<ul id="側導航欄"></ul>`;
var ul_in_siderPage = siderPage.getElementsByTagName("ul");
var content = document.getElementById("content");
var h3_in_content = content.getElementsByTagName("h3");
var do_count = content.getElementsByTagName("h3").length;


for(var i = 0; i < do_count; i++){
    ul_in_siderPage[0].innerHTML = ul_in_siderPage[0].innerHTML + `
    <li>
        <a harf="">${h3_in_content[i].innerHTML}</a>
    </li>
    `;
}

var footerPage = document.getElementById("footerPage");
footerPage.innerHTML = `
<span>
    
</span>
`

//current time
function ShowTime(){
    var x;
    const d = new Date();

    function trans_num_to_ChineseDay(x){
        var word=["日","一","二","三","四","五","六"];
        return word[x];
    }

    function timefix(x){
        if (x<10){
            x = "0" + x;
        }
        return x;
    }

    document.getElementById('showbox').innerHTML = d.getFullYear() + "/" + timefix(d.getMonth()+1) + "/" + timefix(d.getDate()) + "(" + trans_num_to_ChineseDay(d.getDay()) + ") " + timefix(d.getHours()) + ":" + timefix(d.getMinutes()) + ":" + timefix(d.getSeconds()) + " UTC+8";
    setTimeout('ShowTime()',100);
}
var timer = document.getElementById("time");

var footerPage = document.getElementById("footerPage")
footerPage.innerHTML = `
<div style="display:flex; background-color:lightgray;">
<ul style="list-style-type: none;">
    <h3>瞭解詳情</h3>
    <li>
        <a href="team intro.html" style="text-decoration: none;">關於團隊</a>
    </li>
</ul>
<ul style="list-style-type: none;">
    <h3>解決問題</h3>
    <li>
        <a href="" style="text-decoration: none;">聯絡我們</a>
    </li>
</ul>
</div>
`;