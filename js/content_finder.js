// const path = document.location.pathname;
// console.log(path);
// var textname;
// for (i = 0; i < path.length; i++){
//     if (path.indexOf('/',i) === -1){
//         textname = path.substr(i);
//         textname = textname.substr(0, textname.length-5)
//         break;
//     }
// }

// const file = `web_content/${textname}.txt`;

// var middle = document.getElementById("middle");
// middle.innerHTML += `
// <object id="content" title="content of website" type="text/plain" data="${file}"></object>
// `
function content_finder(){
    //content text
    const content_text = document.getElementById("content").contentWindow.frames.document.getElementsByTagName("pre")[0].childNodes[0].data;
    var returnText = "";
    var TextArray = content_text.split("\n");

    for(i=0; i<TextArray.length; i++){
        if(TextArray[i].startsWith(">>>>\\")){
            returnText += TextArray[i].replace(">>>>\\", `<h5 class="from_txt" id="${TextArray[i].replace(">>>>\\", "")}">`);
            returnText += "</h5>";
        }else if(TextArray[i].startsWith(">>>\\")){
            returnText += TextArray[i].replace(">>>\\", `<h4 class="from_txt" id="${TextArray[i].replace(">>>\\", "")}">`);
            returnText += "</h4>";
        }else if(TextArray[i].startsWith(">>\\")){
            returnText += TextArray[i].replace(">>\\", `<h3 class="from_txt" id="${TextArray[i].replace(">>\\", "")}">`);
            returnText += "</h3>";
        }else if(TextArray[i].startsWith(">\\")){
            returnText += TextArray[i].replace(">\\", `<h2 class="from_txt" id="${TextArray[i].replace(">\\", "")}">`);
            returnText += "</h2>";
        }else if(TextArray[i].startsWith(">>>>>")){
            returnText += TextArray[i].replace(">>>>>", `<h6 class="from_txt" id="${TextArray[i].replace(">>>>>", "")}">`);
            returnText += "</h6>";
        }else if(TextArray[i].startsWith(">>>>")){
            returnText += TextArray[i].replace(">>>>", `<h5 class="from_txt" id="${TextArray[i].replace(">>>>", "")}">`);
            returnText += "</h5>";
        }else if(TextArray[i].startsWith(">>>")){
            returnText += TextArray[i].replace(">>>", `<h4 class="from_txt" id="${TextArray[i].replace(">>>", "")}">`);
            returnText += "</h4>";
        }else if(TextArray[i].startsWith(">>")){
            returnText += TextArray[i].replace(">>", `<h3 class="from_txt" id="${TextArray[i].replace(">>", "")}">`);
            returnText += "</h3>";
        }else if(TextArray[i].startsWith(">")){
            returnText += TextArray[i].replace(">", `<h2 class="from_txt" id="${TextArray[i].replace(">", "")}">`);
            returnText += "</h2>";
        }else if(TextArray[i].startsWith("----")){
            returnText += "<hr/>";
        }else if(TextArray[i].startsWith("\\>")){
            returnText += TextArray[i].replace("\\>", "<p>>");
            returnText += "</p>";
        }else{
            returnText += "<p>";
            returnText += TextArray[i];
            returnText += "</p>";
        }
    }

    document.getElementById("content_text").innerHTML = `${returnText}`;
    document.getElementById("content").style.visibility = false;

    var siderPage = document.getElementById("siderPage");
    siderPage.innerHTML = `<ul id="側導航欄"><li><h3>章節列表</h3></li></ul>`;

    var ul_in_siderPage = siderPage.getElementsByTagName("ul");
    var content = document.getElementById("content_text");
    var title_in_content = content.getElementsByClassName("from_txt");
    var do_count = title_in_content.length;
    var layer = 0;

    for(var i = 0; i < do_count; i++){
        ul_in_siderPage = siderPage.getElementsByTagName("ul");
        if(i == 0){
            ul_in_siderPage[0].innerHTML = ul_in_siderPage[0].innerHTML + `
            <li>
                <button onclick="window.location.href='#${title_in_content[i].innerHTML}';">${title_in_content[i].innerHTML}</button>
            </li>
            `;
        }else if(title_in_content[i].tagName == title_in_content[i-1].tagName){
            ul_in_siderPage[layer].innerHTML = ul_in_siderPage[layer].innerHTML + `
            <li>
                <button onclick="window.location.href='#${title_in_content[i].innerHTML}';">${title_in_content[i].innerHTML}</button>
            </li>
            `;
        }else if(title_in_content[i].tagName != title_in_content[i-1].tagName){
            if(title_in_content[i].tagName.substring(1,2) > title_in_content[i-1].tagName.substring(1,2)){
                ul_in_siderPage[layer].innerHTML = ul_in_siderPage[layer].innerHTML + `
                <li><ul>
                    <li>
                        <button onclick="window.location.href='#${title_in_content[i].innerHTML}';">${title_in_content[i].innerHTML}</button>
                    </li>
                </ul></li>
                `
                layer++;
            }else{
                layer--;
                ul_in_siderPage[layer].innerHTML = ul_in_siderPage[layer].innerHTML + `
                    <li>
                        <button onclick="window.location.href='#${title_in_content[i].innerHTML}';">${title_in_content[i].innerHTML}</button>
                    </li>
                `
            }
        }
        
    }
}

