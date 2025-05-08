const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 匯出路由
module.exports = (root) => {
    router.get('/', async (req, res) => {
        data = {
            title: '實用工具 - 立方漣漪研究社',
            heading: '實用工具',
            content: fs.readFileSync(path.join(root, "public/tools/tools.html"), 'utf8') //tools.html
        }

        res.render('general_template', data);
        // const html = await ejs.renderFile(path.join(root, "template/pure_text_content.ejs"), { content_url: '/tools/tools.txt' });
        // data = {
        //     title: '實用工具 - 立方漣漪研究社',
        //     heading: '實用工具',
        //     content: html
        // }
            
        //     res.render('general_template', data);
        // res.sendFile(path.join(root, "template/general_template.css"))
        // res.render('pure_text_content', { content_url: '/tools/tools.txt' })
        
    })

    // request entry point
    router.get('/tools', (req, res) => {
        const data = query_handler(req.query);

        res.render('general_template', data);
    });

    router.get('/:genre/:name', (req, res) => {
        const genre = req.params.genre;
        const toolName = req.params.name;

        data = {
            title: `${genre} - 立方漣漪研究社`,
            heading: `${genre}`,
            content: fs.readFileSync(path.join(root, `public/tools/${genre}/${toolName}.html`), 'utf8')
        }

        res.render('general_template', data);
    });

    router.get('/:genre', (req, res) => {
        const genre = req.params.genre;

        data = {
            title: `${genre} - 立方漣漪研究社`,
            heading: `${genre}`,
            content: fs.readFileSync(path.join(root, `public/tools/${genre}/index.html`), 'utf8')
        }

        res.render('general_template', data);
    });


    return router
}

function query_handler(query) {
    let result = {
        title: '模板 - 立方漣漪研究社',
        heading: '此為模板頁面',
        content: ''
    };

    Object.entries(query).forEach(entry => {
        const [key, value] = entry;

        result[key] = value;
    });

    return result;
}