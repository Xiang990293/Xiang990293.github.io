var headerPage = document.getElementById("headerPage");
headerPage.innerHTML = `
<header id="head">
    <div class="頁首">
        <h1 class="big-title">麥快研究團隊</h1>
        <h2 id="subtitle" class="big-title"></h2>
    </div>
    <nav class="導航欄">
        <button class="導航欄-btn" onclick="window.location.href='./home.html';">首頁</button>
        <button class="導航欄-btn" onclick="window.location.href='./team_intro.html';">關於團隊</button>
        <button class="導航欄-btn" onclick="window.location.href='./mini_game.html';">小遊戲</button>
        <button class="導航欄-btn" onclick="window.location.href='./team_history.html';">團隊歷史</button>
        <button class="導航欄-btn" onclick="window.location.href='./tools.html';">工具</button>
        <button class="導航欄-btn" onclick="window.location.href='./mini_game.html';">小遊戲</button>
        <button class="導航欄-btn" onclick="window.location.href='./contect_to_us.html';">聯絡我們</button>
    </nav>
</header>
`

var footerPage = document.getElementById("footerPage");
footerPage.innerHTML = `
<span>
<button id="showbox"></button>
    <div style="display:flex; background-color:lightgray;">
    <ul style="list-style-type: none;">
        <h3>瞭解詳情</h3>
        <li>
            <a href="team_intro.html" style="text-decoration: none;">關於團隊</a>
        </li>
    </ul>
    <ul style="list-style-type: none;">
        <h3>解決問題</h3>
        <li>
            <a href="contect_to_us.html" style="text-decoration: none;">聯絡我們</a>
        </li>
    </ul>
    </div>
</span>
`;

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

    document.getElementById('showbox').innerHTML = "⏰" + d.getFullYear() + "/" + timefix(d.getMonth()+1) + "/" + timefix(d.getDate()) + "(" + trans_num_to_ChineseDay(d.getDay()) + ") " + timefix(d.getHours()) + ":" + timefix(d.getMinutes()) + ":" + timefix(d.getSeconds()) + " (UTC+8)";
    setTimeout('ShowTime()',100);
}
var timer = document.getElementById("time");

