const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const i18next = require('i18next');

// 匯出路由
module.exports = (root) => {
	router.get('/', async (req, res) => {
		let genres = [];
		
		try {
			genres = await fs.promises.readdir(path.join(root, 'public/mini_game'), { withFileTypes: true });
			genres = genres.filter(dirent => dirent.isDirectory()).map(dirent => {
				const genre = dirent.name;
				const title = i18next.t(`mini_game.${genre}.title`) || genre;
				const description = i18next.t(`mini_game.${genre}.description`) || genre;
				return { 
					genre, 
					title, 
					description,
					link: `/mini_game/${genre}`
				};
			});
		} catch (err) {
			console.error('讀取 mini_game 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}
		
		const data = {
			title: `${i18next.t(`mini_game.root.title`)} - 立方漣漪研究社`,
			heading: `${i18next.t('mini_game.root.title')}`,
			description: `${i18next.t('mini_game.root.description')}`,
			type: 'mini_game',
			genres
		}
		
		res.render('auto_grid_template', {layout: 'general_template', ...data});
	})

	router.get('/:genre', (req, res) => {
		const folderName = req.params.genre;
		const folderPath = path.join(root, `public/mini_game/${folderName}`);

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

						if (!description) description = title.replace(".html", "") + `的小遊戲`;

						// console.log(`${file.replace(".html","")}`);
						resolve({ name: file.replace(".html", ""), title, description });
					});
				});
			})).then(details => {
				// 先渲染root.ejs (內容部分)成 HTML 字串
				res.render(
					'mini_game_root',
					{
						files: details,
						list_title: i18next.t(`mini_game.${folderName}.title`),
						list_description: i18next.t(`mini_game.${folderName}.description`),
						genre: folderName
					},
					(err, html) => {
						if (err) return res.status(500).send("模板渲染錯誤: " + err);

						// 再用general_template.ejs作為布局，插入body內容
						res.render('general_template', {
							title: `${i18next.t(`mini_game.${folderName}.title`)} - ${i18next.t('team.name')}`,
							content: html,
							heading: i18next.t(`mini_game.${folderName}.title`)
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
		//     content: fs.readFileSync(path.join(root, `public/mini_game/${genre}/root.html`), 'utf8')
		// }

		// res.render('general_template', data);
	});

	router.get('/:genre/:name', (req, res) => {
		const genre = req.params.genre;
		const tutorialName = req.params.name;

		const page = path.join(root, `public/mini_game/${genre}/${tutorialName}.html`);

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

				if (!description) description = title.replace(".html", "") + `的小遊戲`;

				// console.log(`${file.replace(".html","")}`);
				resolve({ name: tutorialName.replace(".html", ""), title, description });
			});
		}).then(details => {

			data = {
				heading: details.title,
				title: `${genre} - ${details.title}`,
				content: fs.readFileSync(path.join(root, `public/mini_game/${genre}/${tutorialName}.html`), 'utf8')
			}

			res.render('general_template', data);
		}).catch((err) => {
			res.status(404).send('找不到該小遊戲' + err);
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