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



const ipynb_to_html = require('./modules/ipynb_to_html.js')(ROOT);



// # express.js setting: static files
// Serve static files from public
const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.static('public'));
app.use(express.static('assets'));
app.use('/web_content', express.static('web_content'));
app.use('/code_tutorial', express.static('code_tutorial'));
app.use('/template', express.static('template'));



const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', './template');
// 路由模組
const toolsRouter = require('./router/tools.js')(ROOT);
// 路由掛載
app.use('/tools', toolsRouter);

// Serve favicon
app.get('/favicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'assets', 'favicon.png'));
});

app.get('/personal_web', (req, res) => {
    // console.log("GET req recieved:" + req.url)

    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/template_test', (req, res) => {
    const data = query_handler(req.query);

    res.render('general_template', data);
});

app.get(['/', '/home.html', '/home'], (req, res) => {
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
    console.log(`伺服器開始運行! 在 http://${ip}:${port}`);
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



const bcrypt = require('bcrypt');
async function verifyPassword(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash);
}

/*
// 從資料庫取出該用戶的 hash 密碼
const storedHash = '從資料庫取得的hash字串';

verifyPassword('userPassword123', storedHash).then(isMatch => {
    if (isMatch) {
        console.log('密碼正確，登入成功');
    } else {
        console.log('密碼錯誤，登入失敗');
    }
});
*/



// # sqlite3 setting
// 載入 sqlite3 secure database module
const securedbmod = require('./modules/sqlite_secure.js')(ROOT);
app.get('/user/:id', (req, res) => {
    securedbmod.getUserById(req.params.id, (err, user) => {
        if (err) return res.status(500).send('DB error');
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    });
});



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