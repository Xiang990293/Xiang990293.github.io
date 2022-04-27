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

    document.getElementById("content").innerHTML = new text(file);
}
0