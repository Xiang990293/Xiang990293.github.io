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
			title: '教學 - 立方漣漪研究社',
			heading: '教學',
			content: fs.readFileSync(path.join(root, "public/tutorials/tutorials.html"), 'utf8') //tutorials.html
		}

		res.render('general_template', data);
	})

	router.get('/:genre', (req, res) => {
		const folderName = req.params.genre;
		const folderPath = path.join(root, `public/tutorials/${folderName}`);

		fs.readdir(folderPath, (err, files) => {
			if (err) return res.status(404).send('Folder not found');

			// the list of non root.html html files
			const htmlFiles = files.filter(f => f.endsWith('.html'));
			const otherHtmlFiles = htmlFiles.filter(f => f !== 'root.html');

			Promise.all(otherHtmlFiles.map(file => {
				return new Promise((resolve, reject) => {
					const filePath = path.join(folderPath, file);
					fs.readFile(filePath, 'utf-8', (err, data) => {
						if (err) return reject(err);

						let title = null;
						const titleMatch = data.match(/<title>(.*?)<\/title>/i);
						if (titleMatch) title = titleMatch[1];
						else {
							const h1Match = data.match(/<h1>(.*?)<\/h1>/i);
							if (h1Match) title = h1Match[1];
						}
						if (!title) title = file.replace(".html", "");

						let description = null;
						const descMatch = data.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i);
						if (descMatch) description = descMatch[1];

						if (!description) description = title.replace(".html", "") + `的工具`;

						// console.log(`${file.replace(".html","")}`);
						resolve({ name: file.replace(".html", ""), title, description });
					});
				});
			})).then(details => {
				// 先渲染root.ejs (內容部分)成 HTML 字串
				res.render(
					'tutorials_root',
					{
						files: details,
						list_title: i18next.t(`tutorials.${folderName}.title`),
						list_description: i18next.t(`tutorials.${folderName}.description`),
						genre: folderName
					},
					(err, html) => {
						if (err) return res.status(500).send("模板渲染錯誤: " + err);

						// 再用general_template.ejs作為布局，插入body內容
						res.render('general_template', {
							title: `${i18next.t(`tutorials.${folderName}.title`)} - ${i18next.t('team.name')}`,
							content: html,
							heading: i18next.t(`tutorials.${folderName}.title`)
						});
					}
				);
			}).catch((err) => {
				res.status(500).send('讀取檔案錯誤' + err);
			});
		});

		// data = {
		//     title: `${genre} - 立方漣漪研究社`,
		//     heading: `${genre}`,
		//     content: fs.readFileSync(path.join(root, `public/tutorials/${genre}/root.html`), 'utf8')
		// }

		// res.render('general_template', data);
	});

	router.get('/:genre/:name', (req, res) => {
		const genre = req.params.genre;
		const tutorialName = req.params.name;

		const page = path.join(root, `public/tutorials/${genre}/${tutorialName}.html`);

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

				if (!description) description = title.replace(".html", "") + `的教學`;

				// console.log(`${file.replace(".html","")}`);
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