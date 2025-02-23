var headerPage = document.getElementById("headerPage")
headerPage.innerHTML = `
<div id="head">
    <button id="showbox"></button>
    <div class="頁首">
        <h1 class="big-title">翔越風的高山草原</h1>
        <h2 id="subtitle" class="big-title"></h2>
    </div>
    <div class="導航欄">
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
        <button class="導航欄-btn" onclick="window.location.href='';">none</button>
    </div>
</div>
`

//網站副標題
var subtitle = document.getElementById("subtitle")
subtitle.innerHTML = "歡迎來到翔越風的個人網站";

var content = document.getElementById("content");
/*開始輸入網頁內文 由Xiang990293.txt */
fs.readFile('../個人網站站內內文庫/Xiang990293.txt', function (err, data) {
    if (err) throw err;
    console.log(data);
});
/*結束輸入網頁內文 由Xiang990293.txt */

//內文側邊
var siderPage = document.getElementById("siderPage");
siderPage.innerHTML = `<ul id="側導航欄"></ul>`;
var ul_in_siderPage = siderPage.getElementsByTagName("ul");
var h3_in_content = content.getElementsByTagName("h3");
var do_count = content.getElementsByTagName("h3").length;


for(var i = 0; i < do_count; i++){
    ul_in_siderPage[0].innerHTML = ul_in_siderPage[0].innerHTML + `
    <li>
        <a harf="">${h3_in_content[i].innerHTML}</a>
    </li>
    `
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
    const word=["日","一","二","三","四","五","六"];
    
    function timefix(x){
        if (x<10){
            x = "0" + x;
        }
        return x;
    }

    document.getElementById('showbox').innerHTML = d.getFullYear() + "/" + timefix(d.getMonth()+1) + "/" + timefix(d.getDate()) + "(" + word[d.getDay()] + ") " + timefix(d.getHours()) + ":" + timefix(d.getMinutes()) + ":" + timefix(d.getSeconds()) + " UTC+8";
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
`
function textReader(){
    let fileReader = new FileReader();
    fileReader.readAsText("Xiang990293.txt");
    fileReader.onload = function(){
        document.getElementById("content").innerHTML = fileReader.result();
    }
    fileReader.onerror = function(){
        alert(fileReader.error);
    }
}

