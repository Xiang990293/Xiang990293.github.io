const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const i18next = require('i18next');
const { ScanToolsFolder } = require("../modules/services/folderScanner")

// 匯出路由
module.exports = (root) => {
	router.get('/', async (req, res) => {
		res.status(400).send('格式錯誤');
	})

	router.get('/:genre', async (req, res) => {
		const folderName = req.params.genre;
		try {
			const result = await ScanToolsFolder(path.join(root, "public", folderName))
			res.json(result)

		} catch (err) {
			res.status(500).json({error: "未知失敗"})
		}
	});


	/*
	router.get('/:genre/:name', (req, res) => {
		const genre = req.params.genre;
		const tutorialName = req.params.name;

		const page = path.join(root, "public", "tutorials", genre, tutorialName+".html");

		new Promise((resolve, reject) => {
			fs.readFile(page, 'utf-8', (err, data) => {
				if (err) return reject(err);

				let title = null;
				const titleMatch = data.match(/<title>(.*?)<\/title>/i);
				if (titleMatch) title = titleMatch[1];
				else {
					const h1Match = data.match(/<h1>(.*?)<\/h1>/i);
					if (h1Match) title = h1Match[1];
				}
				if (!title) title = tutorialName.replace(".html", "");

				let description = null;
				const descMatch = data.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i);
				if (descMatch) description = descMatch[1];

				if (!description) description = title.replace(".html", "") + "的教學";

				// console.log(file.replace(".html",""));
				resolve({ name: tutorialName.replace(".html", ""), title, description });
			});
		}).then(details => {

			data = {
				heading: details.title,
				title: `${genre} - ${details.title}`,
				content: fs.readFileSync(path.join(root, `public/tutorials/${genre}/${tutorialName}.html`), 'utf8')
			}

			res.render('general_template', data);
		}).catch((err) => {
			res.status(404).send('找不到該教學' + err);
		});
	});
	*/

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