function content_finder(){
    var path = document.location.pathname;
    
    var textname;
    for (i = 0; i < path.length; i++){
        if (path.indexOf('/',i) === -1){
            textname = path.substr(i);
            textname = textname.substr(0, textname.length-5)
            break;
        }
    }
    console.log(textname);
    
    const file = `web_constent/${textname}.txt`;
    console.log(file);

    document.getElementById("content").innerHTML = document.location.pathname;

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
}

