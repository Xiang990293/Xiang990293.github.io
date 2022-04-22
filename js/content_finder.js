var path = document.location.pathname;
const filename = path.substr(1,a.length-6);

var data = readTextFile(`./web_content/${file}.txt`);
console.log(data);