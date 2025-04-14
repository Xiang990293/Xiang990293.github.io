function content_finder(){
    //content text
    const content_text = document.getElementById("content").contentWindow.frames.document.getElementsByTagName("pre")[0].childNodes[0].data;
    var returnText = content_text;

	//content syntex analizer
    returnText = returnText.replace(/```(.*?)```/gs,`<stoptrans><object title="1" style="background-color:gray; border: 3px solid black; border-radius: 10px; width:300px">$1</object></stoptrans>`)
    var titles = returnText.match(/^>+(.+?)$/gm)

    for(title_index=0; title_index<titles.length; title_index++){
		
		temp_title = titles[title_index].replace(/(\\)/gm,"\\$1").replace(/(\()/gm,"\\$1").replace(/(\))/gm,"\\$1").replace(/(\!)/gm,"\\$1").replace(/(\^)/gm,"\\$1").replace(/(\$)/gm,"\\$1").replace(/(\*)/gm,"\\$1").replace(/(\+)/gm,"\\$1").replace(/(\?)/gm,"\\$1").replace(/(\{)/gm,"\\$1").replace(/(\})/gm,"\\$1").replace(/(\[)/gm,"\\$1").replace(/(\])/gm,"\\$1").replace(/(\,)/gm,"\\$1").replace(/(\.)/gm,"\\$1").replace(/(\:)/gm,"\\$1").replace(/(\<)/gm,"\\$1").replace(/(\=)/gm,"\\$1").replace(/(\|)/gm,"\\$1").replace(/(\-)/gm,"\\$1") //.replace(/(\>)/gm,"\\$1")
        current_title_regexp = new RegExp(`^(${temp_title})$`,"gm")
        title_type = temp_title.match(/^>+/gm)[0].length+1;
		
		group_1_in_current_title = titles[title_index].replace(/^>+(.+?)$/gm,"$1")
        
		returnText = returnText.replace(current_title_regexp,`<h${title_type} class="from_txt" id="${group_1_in_current_title}-${title_index}">${group_1_in_current_title}</h${title_type}>`)
    }
    
	returnText = returnText.replace(/^----$/gm, "<hr/>")					// "----" -> "<hr/>"
	returnText = returnText.replace(/(?<!\\)@color(#[0-9a-fA-F]{6}){(.+?)(?<!\\)}/gm, `<p style="color: $1">$2</p>`)	// change color "<p style></p>""
	returnText = returnText.replace(/(?<!\\)@bold{(.+?)(?<!\\)}/gm, `<p style="font-weight: bold">$1</p>`)	// change bold "<p style></p>""
	returnText = returnText.replace(/(?<!\\)@button\((https?:\/\/.+?)(?<!\()\)(?:\(tag=(a|p|button)(?:,(style=".+?"))?\))?(?<!\\){(.+?)(?<!\\)}/gm, `<$2 class="text-to-button" onclick="window.location.href='$1'" $3>$4</$2>`)	// add button "<$2 class="text-to-button" href="$1" $3>$4</$2>""
	// returnText = returnText.replace(/^(?<!<)(.+?)(?!>)$/gs, "<p>$1</p>")	// put plain text into "<p></p>""

	document.getElementById("content_text").innerHTML = returnText
    document.getElementById("content").style.visibility = false;

	// siderpage/navigation construct
    var siderPage = document.getElementById("siderPage");
    siderPage.innerHTML = `<ul id="側導航欄"><li><h3>章節列表</h3></li></ul>`;

    var ul_in_siderPage = siderPage.getElementsByTagName("ul");
    var content = document.getElementById("content_text");
    var title_in_content = content.getElementsByClassName("from_txt");
    var do_count = title_in_content.length;
    var layer = 0;
    var layer_max = 0;

    for(i = 0; i < do_count; i++){
        // ul_in_siderPage = siderPage.getElementsByTagName("ul");
        if(i === 0){
            ul_in_siderPage[0].innerHTML = ul_in_siderPage[0].innerHTML + `<li><button type="button" onclick="window.location.href='#${title_in_content[i].innerHTML+"-"+i}';">${title_in_content[i].innerHTML}</button></li>`;
            continue
        }
        
        if(title_in_content[i].tagName === title_in_content[i-1].tagName){
            ul_in_siderPage[layer].innerHTML = ul_in_siderPage[layer].innerHTML + `<li><button type="button" onclick="window.location.href='#${title_in_content[i].innerHTML+"-"+i}';">${title_in_content[i].innerHTML}</button>`;
            continue
        }
        
        if(title_in_content[i].tagName.substring(1,2) > title_in_content[i-1].tagName.substring(1,2)){
            ul_in_siderPage[layer].innerHTML = ul_in_siderPage[layer].innerHTML + `<li><ul><li><button type="button" onclick="window.location.href='#${title_in_content[i].innerHTML+"-"+i}';">${title_in_content[i].innerHTML}</button></li></ul></li>`;
            layer_max++;
            layer = layer_max;
            continue
        }
        
        if(title_in_content[i].tagName === title_in_content[0].tagName) layer = 0 
        else layer += title_in_content[i].tagName.substring(1,2) - title_in_content[i-1].tagName.substring(1,2)
        
        ul_in_siderPage[layer].innerHTML = ul_in_siderPage[layer].innerHTML + `<li><button type="button" onclick="window.location.href='#${title_in_content[i].innerHTML+"-"+i}';">${title_in_content[i].innerHTML}</button></li>`
    }
}