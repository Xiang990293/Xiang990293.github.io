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

// send rendom picture in home album
app.get('/random_album', (req, res) => {
    fs.readdir(path.join(ROOT, "web_content", "home", "header_background"), (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        if (images.length === 0) {
            return res.status(404).send('No images found');
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];
        res.sendFile(path.join(ROOT, "web_content", "home", "header_background", randomImage));
    });
});

app.get('/all_album', (req, res) => {
    fs.readdir(path.join(ROOT, "web_content", "home", "header_background"), (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json({pics: images})
    })
});

// **outdated
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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/user/:id', (req, res) => {
    securedbmod.getUserById(req.params.id, (err, user) => {
        if (err) return res.status(500).send('DB error');
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    });
});

// # sqlite3 setting
// 載入 sqlite3 secure database module
const securedbmod = require('./modules/sqlite_secure.js')(ROOT);
app.use(express.urlencoded({ extended: true })); // 處理 form-urlencoded（表單）資料
app.use(express.json()); // 處理 JSON 資料（如果有用到）
app.post('/auth', async (req, res) => {
    if (req.body.password === undefined || req.body.username === undefined) {
        res.json({ success: false, message: '帳號/密碼缺失' });
        return;
    }

    const { username, password } = req.body;
    try {
        const isValid = await securedbmod.verifyPassword(username, password)


        if (isValid) res.json({ success: true, message: '登入成功' });
        else res.json({ success: false, message: '帳號或密碼錯誤，若尚未註冊，請先註冊' });;
    } catch (err) {
        if (err.message === 'username not found') {
            res.json({ success: false, message: '帳號不存在，請先註冊' });
        } else {
            console.error(err);
            res.json({ success: false, message: '伺服器錯誤' });
        }
    }
});

app.post('/registering', async (req, res) => {
    if (req.body.password === undefined || req.body.username === undefined || req.body.email === undefined) {
        res.json({ success: false, message: '帳號/密碼/信箱缺失' });
        return;
    }

    const { username, password } = req.body;
    try {
        const isEmailExist = await securedbmod.checkEmail(username, password)

        if (isEmailExist) res.json({ success: true, message: '電子郵件已被註冊，請嘗試登入或聯絡管理員' });
        else await securedbmod.addUser(username, password, email)
    } catch (err) {
        if (err.message === 'username not found') {
            res.json({ success: false, message: '帳號不存在，請先註冊' });
        } else {
            console.error(err);
            res.json({ success: false, message: '伺服器錯誤' });
        }
    }
});

// Error handling for 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); // 404 Not Found
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

app.listen(port, () => {
    console.log(`伺服器開始運行! 在 http://${ip}:${port}`);
});
