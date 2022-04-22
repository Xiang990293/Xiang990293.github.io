function content_finder(file){

    var path = document.location.pathname;
    const filename = path.substr(1,a.length-6);

    readTextFile(`./web_content/${file}.txt`);
    fs.readFile(`./web_content/${file}.txt`, (err,data) => {
        if(err){
            data = '';
        }else{
            console.log(data);
        }
    });
}