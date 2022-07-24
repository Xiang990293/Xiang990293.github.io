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
        if(TextArray[i].startsWith(">>>>")){
            returnText += TextArray[i].replace(">>>>", "<h6>");
            returnText += "</h6>";
        }else if(TextArray[i].startsWith(">>>")){
            returnText += TextArray[i].replace(">>>", "<h5>");
            returnText += "</h5>";
        }else if(TextArray[i].startsWith(">>")){
            returnText += TextArray[i].replace(">>", "<h4>");
            returnText += "</h4>";
        }else if(TextArray[i].startsWith(">")){
            returnText += TextArray[i].replace(">", "<h3>");
            returnText += "</h3>";
        }else if(TextArray[i].startsWith("----")){
            returnText += "<hr/>";
        }else{
            returnText += "<p>";
            returnText += TextArray[i];
            returnText += "</p>";
        }
    }

    document.getElementById("content_text").innerHTML = `${returnText}`;
    document.getElementById("content").style.visibility = false;

    var siderPage = document.getElementById("siderPage");
    siderPage.innerHTML = `<ul id="側導航欄"></ul>`;

    var ul_in_siderPage = siderPage.getElementsByTagName("ul");
    var content = document.getElementById("content_text");
    var h3_in_content = content.getElementsByTagName("h3");
    var do_count = content.getElementsByTagName("h3").length;

    for(var i = 0; i < do_count; i++){
        ul_in_siderPage[0].innerHTML = ul_in_siderPage[0].innerHTML + `
        <li>
            <a harf="">${h3_in_content[i].innerHTML}</a>
        </li>
        `;
    }
}

