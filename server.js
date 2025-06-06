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
require('dotenv').config();



const ipynb_to_html = require('./modules/ipynb_to_html.js')(ROOT);


// # express.js setting: static files
// Serve static files from public
const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
const cookieParser = require('cookie-parser');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/web_content', express.static('web_content'));
app.use('/code_tutorial', express.static('code_tutorial'));
app.use('/template', express.static('template'));
app.use(cookieParser());



// # express.js setting: view engine
// 使用 EJS 作為模板引擎
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', './template');



// 路由模組 & 路由掛載
const toolsRouter = require('./router/tools.js')(ROOT);
const pythonRouter = require('./router/python.js')(ROOT);
app.use('/tools', toolsRouter);
app.use('/python', pythonRouter);

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
        res.json({ pics: images })
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
        content: fs.readFileSync(path.join(ROOT, "public/team_intro.html"), 'utf8')
    }

    res.render('general_template', data);
});

app.get('/login', (req, res) => {
    data = {
        title: '登入 - 立方漣漪研究社',
        form_type_and_logic: fs.readFileSync(path.join(ROOT, "public/login.html"), 'utf8')
    }

    res.render('login_system', data);
});

app.get('/register', (req, res) => {
    data = {
        title: '註冊 - 立方漣漪研究社',
        form_type_and_logic: fs.readFileSync(path.join(ROOT, "public/register.html"), 'utf8')
    }

    res.render('login_system', data);
});

app.get('/forgot_password', (req, res) => {
    data = {
        title: '忘記密碼 - 立方漣漪研究社',
        form_type_and_logic: fs.readFileSync(path.join(ROOT, "public/forgot_password.html"), 'utf8')
    }

    res.render('login_system', data);
});

app.get('/reset_password', (req, res) => {
    data = {
        title: '重設密碼 - 立方漣漪研究社',
        form_type_and_logic: fs.readFileSync(path.join(ROOT, "public/reset_password.html"), 'utf8')
    }

    res.render('login_system', data);
});

app.get('/test_python', (req, res) => {
    data = {
        title: 'nan py - 立方漣漪研究社',
        form_type_and_logic: fs.readFileSync(path.join(ROOT, "public/test_python.html"), 'utf8')
    }

    res.sendFile(path.join(ROOT, "public/test_python.html"));
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        res.redirect('/login');
        return;
    }
    res.send(`User ID: ${userId}`);

    // res.render('user_profile', { userId });
});



// # sqlite3 setting
// 載入 sqlite3 secure database module
const securedbmod = require('./modules/sqlite_secure.js')(ROOT);
app.post('/auth', async (req, res) => {
    if (req.body.password === undefined || req.body.username === undefined) {
        res.json({ success: false, message: '帳號/密碼缺失' });
        return;
    }

    const { username, password } = req.body;
    try {
        const row = await securedbmod.verifyPassword(username, password)
        const isValid = row.success;
        const userId = row.userid


        if (!isValid) {
            res.json({ success: false, message: '帳號或密碼錯誤，若尚未註冊，請先註冊' });
            return;
        }

        // Set the cookie
        res.cookie('userId', userId, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 30 days
            httpOnly: true,   // Cookie cannot be accessed by client-side JavaScript
            secure: true,     // Only sent over HTTPS (in production)
            sameSite: 'strict' // Help prevent CSRF attacks
        });
        res.json({ success: true, message: '登入成功', userid: userId });

        return;
    } catch (err) {
        if (err === 'username not found') {
            res.json({ success: false, message: '帳號不存在，請先註冊' });
            return
        }

        console.error(err);
        res.json({ success: false, message: '伺服器錯誤' });
    }
});

app.post('/registering', async (req, res) => {
    if (req.body.password === undefined || req.body.username === undefined || req.body.email === undefined) {
        res.json({ success: false, message: '帳號/密碼/信箱缺失' });
        return;
    }

    const { username, password, email } = req.body;
    try {
        const isEmailExist = await securedbmod.checkEmail(email)

        if (isEmailExist) {
            res.json({ success: false, message: '電子郵件已被註冊，請嘗試登入或聯絡管理員' });
            return;
        }

        await securedbmod.addUser(username, email, password);
        res.json({ success: true, message: '註冊成功', userid: await securedbmod.getIdbyEmail(email) });
        return;
    } catch (err) {
        if (err.message === 'username not found') {
            res.json({ success: false, message: '帳號不存在，請先註冊' });
            return;
        }

        console.error(err);
        res.json({ success: false, message: '伺服器錯誤' });
        return;
    }
});

const crypto = require('crypto');
const nodemailer = require('nodemailer');
app.post('/verifying_email', async (req, res) => {
    if (req.body.username === undefined || req.body.email === undefined) {
        res.json({ success: false, message: '帳號/信箱缺失' });
        return;
    }

    const { username, email } = req.body;
    try {
        const isUserOwnEmail = await securedbmod.checkUsernameAndEmailPair(username, email)

        if (!isUserOwnEmail) {
            res.json({ success: false, message: '電子郵件錯誤' });
            return;
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expire = Date.now() + 600000; // 10分鐘過期
        await securedbmod.saveVerifyingEmailToken(email, token, expire).catch((err) => {
            res.json({ success: false, message: `發送失敗: ${err.message}` });
            return;
        })

        const resetLink = `${process.env.DOMAIN_NAME}/reset_password?token=${token}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        // Setup email data
        const info = await transporter.sendMail({
            from: '"立方漣漪研究社" <rippou.ripple.web.noreply@google.com>', // sender address
            to: email, // list of receivers
            subject: 'reset password 重設密碼', // Subject line
            text: `請點擊以下連結重設密碼：${resetLink}`,
            html: `<p>請點擊以下連結重設密碼：<a href="${resetLink}">${resetLink}</a></p>`
        });

        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, message: '已發送驗證信件，可能被視為垃圾郵件' });
        return;

    } catch (err) {
        if (err.message === 'username not found') {
            res.json({ success: false, message: '帳號不存在，請先註冊' });
            return;
        }
        if (err.message === 'email not found') {
            res.json({ success: false, message: '帳號不存在，請先註冊' });
            return;
        }

        console.error(err);
        res.json({ success: false, message: '伺服器錯誤' });
        return;
    }
});

app.post('/reseting_password', async (req, res) => {
    const { token, password } = req.body;
    // 1. 驗證 token 是否存在且未過期
    const row = await securedbmod.getResetToken(token);
    if (!row || row.expire < Date.now()) {
        return res.json({ success: false, message: 'Token 無效或已過期' });
    }

    // 2. 更新密碼（請用 bcrypt hash）
    const email = await securedbmod.getEmailByToken(token);

    await securedbmod.updateUserPasswordWithEmail(email, password);

    // 3. 刪除 token 或標記已使用
    await securedbmod.deleteVerifyingEmailToken(token);
    res.json({ success: true, message: '密碼已成功重設' });
});

// # 
const minecraft_server_map = require('./modules/minecraft_server_map.js')(ROOT);
const bodyParser = require('body-parser');
// // 調整 JSON 請求體大小限制，例如設定 50mb
// // 調整 URL-encoded 請求體大小限制及參數數量
app.use(bodyParser.json({ limit: '500mb' })); // 處理 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 10000000 }));

app.post('/rippou-ripple-server/survival/upload', (req, res) => {
    req.query.map_name = req.query.map_name || 'new_file';
    console.log('收到資料:', req.body);
    try {
        minecraft_server_map.upload_map(req.query.map_name, req.body);
        res.send('資料已收到');
    } catch (err) {
        console.error(err);
        res.status(500).send('上傳地圖時發生錯誤');
    }
});
app.get('/rippou-ripple-server/survival/query/:map_name', (req, res) => {
    map_name = req.params.map_name;
    try {
        const map_data = minecraft_server_map.get_map(map_name);
        res.status(200).json(map_data);
    } catch (err) {
        console.error(err);
        res.status(500).send('獲取地圖時發生錯誤');
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



const i18next = require('i18next');



app.listen(port, () => {
    console.log(`伺服器開始運行! 在 http://${ip}:${port}`);
});
