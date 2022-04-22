function content_finder(file){
    var path = document.location.pathname;
    const filename = path.substr(1,path.length-6);

    var data = blob.text(`./web_content/${file}.txt`);
    console.log(data);
    console.log(1);
}
