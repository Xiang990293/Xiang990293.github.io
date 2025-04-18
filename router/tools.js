const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 匯出路由
module.exports = (root) => {
    router.get('/', (req, res) => {
        data = {
            title: '實用工具 - 立方漣漪研究社',
            heading: '實用工具',
            content: fs.readFileSync(path.join(root, "public/tools/tools.html"), 'utf8') //tools.html
        }

        res.render('general_template', data);
        // ejs.renderFile(path.join(root, "template/pure_text_content.ejs"), { content_url: '/tools/tools.txt' }).then(
        //     html => {
        //         data = {
        //             title: '實用工具 - 立方漣漪研究社',
        //             heading: '實用工具',
        //             content: html
        //         }
                
        //         res.render('general_template', data);
        // })
        // res.sendFile(path.join(root, "template/general_template.css"))
        // res.render('pure_text_content', { content_url: '/tools/tools.txt' })
        
    })

    // request entry point
    router.get('/tools', (req, res) => {
        const data = query_handler(req.query);

        res.render('general_template', data);
    });

    return router
}