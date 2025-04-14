// # configuration and constant
const port = 3000;
const ip = "0.0.0.0";//"172.28.246.224" ,"192.168.124.17";



// # ipynb to html
// Convert all .ipynb files in /notebooks
const { renderNotebook } = require('ipynb2html-core');
const fs = require("fs");
fs.readdirSync('./notebooks').forEach(file => {
    if (file.endsWith('.ipynb')) {
      const notebook = JSON.parse(fs.readFileSync(`./notebooks/${file}`, 'utf8'));
      const html = renderNotebook(notebook).outerHTML;
      fs.writeFileSync(`./code_tutorial/${file.replace('.ipynb', '.html')}`, html);
    }
}); 



// # express.js setting: static files
// Serve static files from public
const ejs = require('ejs');
const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.set('views', './public/template');
app.use(express.static('public'));
app.use(express.static('assets'));
app.use('/web_content', express.static('web_content'));

// Serve favicon
app.get('/favicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'favicon.png'));
});

app.get('/personal_web', (request, response) => {
	// console.log("GET request recieved:" + request.url)

    res.sendFile(path.join(__dirname, 'home.html'));
});

// request entry point
app.get('/template_test', (request, response) => {
	console.log(request.query)

    const data = query_handler(request.query);

    response.render('general_template', data);
});

app.get('/', (request, response) => {
	// console.log("GET request recieved:" + request.url)

    res.sendFile(path.join(__dirname, 'home.html'));
});

// Error handling for 404
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(port, () =>{
    console.log(`Server start running! At http://${ip}:${port}`);
});

function query_handler(querys) {
    let result = {
        title: '模板 - 立方漣漪研究社',
        heading: '此為模板頁面',
        iframe: '404.html',
        content_url: 'web_content/home.txt',
    };

    Object.entries(querys).forEach(entry => {
        const [key, value] = entry;

        result[key] = value;
    });

    return result;
}