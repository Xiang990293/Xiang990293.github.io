// # configuration and constant
const port = 3000;
const ip = "0.0.0.0";//"172.28.246.224" ,"192.168.124.17";
// Map of file extensions to mime types
const mimeTypes = {
  ico: 'image/x-icon',
  js: 'text/javascript',
  css: 'text/css',
  svg: 'image/svg+xml',
  png: 'image/png'
}




// # sqlite3 setting
const sqlite3 = require('sqlite3')
// open database
// process.env.DATABASE_URL ||= url.pathToFileURL('production.sqlite3').toString()
// const db = new sqlite3.Database(new URL(process.env.DATABASE_URL).pathname.slice(1))

// Ensure welcome table exists
// db.run('CREATE TABLE IF NOT EXISTS "welcome" ( "count" INTEGER )')




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

/*
// Process requests based on pathname
async function listener(request, response) {
    const { pathname } = url.parse(request.url)

    if (pathname === '/') {
        await main(request, response)
    } else if (fs.existsSync(`public${pathname}`)) {
        try {
            const contents = fs.readFileSync(`public${pathname}`, 'utf-8')
            const mimeType = mimeTypes[pathname.split('.').pop()] || 'application/octet-stream'

            response.writeHead(200, { 'Content-Type': mimeType })
            response.write(contents, 'utf-8')
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain' })
            response.write(error + '\n')
        }

        response.end()
    } else {
        response.writeHead(404)
        response.end('Not found.')
    }
}

// Main page
async function main(_request, response) {
    // increment counter in counter.txt file
    try {
        count = parseInt(fs.readFileSync('counter.txt', 'utf-8')) + 1
    } catch {
        count = 1
    }

    fs.writeFileSync('counter.txt', count.toString())

    // render HTML response
    try {
        let contents = fs.readFileSync('views/index.tmpl', 'utf-8')
        contents = contents.replace('@@COUNT@@', count.toString())

        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.write(contents, 'utf-8')
    } catch (error) {
        response.writeHead(500, { 'Content-Type': 'text/plain' })
        response.write(error + '\n')
    }

    response.end()
}

*/

// access dataabase like this
/*

// get method
db.get('SELECT "count" from "welcome"', (err, row) => {
    let query = 'UPDATE "welcome" SET "count" = ?'

    if (err) {
        reject(err)
        return
    }
    
    if (row) {
        count = row.count + 1
    } else {
        count = 1
        query = 'INSERT INTO "welcome" VALUES(?)'
    }

    db.run(query, [count], err => {
    err ? reject(err) : resolve()
    })
})

*/