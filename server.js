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
const ROOT = __dirname;



// # ipynb to html
// Convert all .ipynb files in /notebooks
const ipynb = require('ipynb2html');
const { Document } = require("nodom");
const fs = require("fs");

fs.readdirSync('./notebooks').forEach(file => {
    if (file.endsWith('.ipynb')) {
        // Create a DOM document instance
        const document = new Document();
        const renderNotebook = ipynb.createRenderer(document)
        const notebook = JSON.parse(fs.readFileSync(`./notebooks/${file}`, 'utf8'));
        const html = renderNotebook(notebook).outerHTML;
        fs.writeFileSync(`./code_tutorial/${file.replace('.ipynb', '.html')}`, html);
    }
});



// # express.js setting: static files
// Serve static files from public
const path = require('path');
const express = require("express");
const app = express();
app.use(express.static('public'));
app.use(express.static('assets'));
app.use('/web_content', express.static('web_content'));
app.use('/code_tutorial', express.static('code_tutorial'));
app.use('/template', express.static('template'));

const ssi = require('ssi');
const parser = new ssi(__dirname, __dirname, '/**/*.html', true);

const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', './template');
// 路由模組
const toolsRouter = require('./router/tools.js')(ROOT);
// 路由掛載
app.use('/tools', toolsRouter);


// Serve favicon
app.get('/favicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'favicon.png'));
});

app.get('/personal_web', (req, res) => {
    // console.log("GET req recieved:" + req.url)

    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/template_test', (req, res) => {
    const data = query_handler(req.query);

    res.render('general_template', data);
});

app.get(['/','/home.html', '/home'], (req, res) => {
    res.render('home');
});

app.get('/member_intro', (req, res) => {
    data = {
        title: '團隊成員 - 立方漣漪研究社',
        heading: '團隊成員',
        content: fs.readFileSync(path.join(ROOT, "public/member_intro.html"), 'utf8') //tools.html
    }

    res.render('general_template', data);
});

app.get('/team_intro', (req, res) => {
    data = {
        title: '關於團隊 - 立方漣漪研究社',
        heading: '關於團隊',
        content: fs.readFileSync(path.join(ROOT, "public/team_intro.html"), 'utf8') //tools.html
    }

    res.render('general_template', data);
});

// Error handling for 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); // 404 Not Found
});

app.listen(port, () => {
    console.log(`Server start running! At http://${ip}:${port}`);
});

function query_handler(querys) {
    /*
        this function is specially work for template,
        do not use if you don't know what you are doing.
    */

    let result = {
        title: '模板 - 立方漣漪研究社',
        heading: '此為模板頁面',
        content: ''
    };

    Object.entries(querys).forEach(entry => {
        const [key, value] = entry;

        result[key] = value;
    });

    return result;
}




// # sqlite3 setting
// 載入 sqlite3
const sqlite3 = require('sqlite3').verbose();
// 新增一個sqlite3的資料庫
// var db = new sqlite3.Database(file);

// // Ensure welcome table exists
// db.run('CREATE TABLE IF NOT EXISTS "welcome" ( "count" INTEGER )')

const securedb = new sqlite3.Database('./secure.sqlite', (err) => {
    if (err) {
        console.error('Error opening secure database:', err.message);
    } else {
        console.log('Connected to secure database.');
    }
});

// // 建立第二個資料庫連線
// const db2 = new sqlite3.Database('./database2.sqlite', (err) => {
//     if (err) {
//         console.error('Error opening database2:', err.message);
//     } else {
//         console.log('Connected to database2.');
//     }
// });
// Ensure users table exists

securedb.run(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(75) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);`)

// access database as admin
// app.get('/admin/database', (req, res) => {
//     const query = req.query
//     db1.get(`SELECT * FROM `, [], (err, row) => {
//       if (err) {
//         return res.status(500).send('Database error');
//       }
//       // 使用 db2 進行其他操作
//       db2.get('SELECT * FROM tableB', [], (err, row2) => {
//         if (err) {
//           return res.status(500).send('Database error');
//         }
//         res.json({ data1: row, data2: row2 });
//       });
//     });
//   });




/*
// Process reqs based on pathname
async function listener(req, res) {
    const { pathname } = url.parse(req.url)

    if (pathname === '/') {
        await main(req, res)
    } else if (fs.existsSync(`public${pathname}`)) {
        try {
            const contents = fs.readFileSync(`public${pathname}`, 'utf-8')
            const mimeType = mimeTypes[pathname.split('.').pop()] || 'application/octet-stream'

            res.writeHead(200, { 'Content-Type': mimeType })
            res.write(contents, 'utf-8')
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.write(error + '\n')
        }

        res.end()
    } else {
        res.writeHead(404)
        res.end('Not found.')
    }
}

// Main page
async function main(_req, res) {
    // increment counter in counter.txt file
    try {
        count = parseInt(fs.readFileSync('counter.txt', 'utf-8')) + 1
    } catch {
        count = 1
    }

    fs.writeFileSync('counter.txt', count.toString())

    // render HTML res
    try {
        let contents = fs.readFileSync('views/index.tmpl', 'utf-8')
        contents = contents.replace('@@COUNT@@', count.toString())

        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(contents, 'utf-8')
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.write(error + '\n')
    }

    res.end()
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