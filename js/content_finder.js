function content_finder(){
    var path = document.location.pathname;
    
    var textname;
    for (i = 0; i < path.length; i++){
        if (a.indexOf('/',i) === -1){
            textname = path.substr(i);
            textname = textname.substr(0, b.length-5)
            break;
        }
    }
    
    const file = `web_constent/${textname}.txt`;

    document.getElementById("content").innerHTML = text(file);
}
