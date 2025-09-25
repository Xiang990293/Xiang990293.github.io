const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const i18next = require('i18next');

// 匯出路由
module.exports = (root) => {
    router.get('/', async (req, res) => {
        data = {
            title: '實用工具 - 立方漣漪研究社',
            heading: '實用工具',
            content: fs.readFileSync(path.join(root, "public/tools/tools.html"), 'utf8') //tools.html
        }

        res.render('general_template', data);        
    })

    router.get('/:genre', (req, res) => {
        const genre = req.params.genre;

        data = {
            title: `${genre} - 立方漣漪研究社`,
            heading: `${genre}`,
            content: fs.readFileSync(path.join(root, `public/tools/${genre}/root.html`), 'utf8')
        }

        res.render('general_template', data);
    });

    router.get('/:genre/:name', (req, res) => {
        const genre = req.params.genre;
        const toolName = req.params.name;

        data = {
            title: `${genre} - ${toolName} - 立方漣漪研究社`,
            heading: `${genre} - ${toolName}`,
            content: fs.readFileSync(path.join(root, `public/tools/${genre}/${toolName}.html`), 'utf8')
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

function get_list_of_tools(root) {
    const toolsDir = path.join(root, 'public', 'tools');
    let toolsList = {};

    const genres = fs.readdirSync(toolsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    genres.forEach(genre => {
        const genrePath = path.join(toolsDir, genre);
        const tools = fs.readdirSync(genrePath)
            .filter(file => file.endsWith('.html') && file !== 'root.html')
            .map(file => path.basename(file, '.html'));

        toolsList[genre] = tools;
    });

    return toolsList;
}