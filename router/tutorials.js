const ejs = require('ejs');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const i18next = require('i18next');
const cheerio = require('cheerio');

// 匯出路由
module.exports = (root) => {
	router.get('/', async (req, res) => {
		let genres = [];
		
		try {
			genres = await fs.promises.readdir(path.join(root, 'public/tutorials'), { withFileTypes: true });
			genres = genres.filter(dirent => dirent.isDirectory()).map(dirent => {
				const genre = dirent.name;
				const title = i18next.t(`tutorials.${genre}.title`) || genre;
				const description = i18next.t(`tutorials.${genre}.description`) || genre;
				return { 
					genre, 
					title, 
					description,
					link: `/tutorials/${genre}`
				};
			});
		} catch (err) {
			console.error('讀取 tutorials 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}
		
		const data = {
			title: `${i18next.t(`tutorials.root.title`)} - 立方漣漪研究社`,
			heading: `${i18next.t('tutorials.root.title')}`,
			description: `${i18next.t('tutorials.root.description')}`,
			type: 'tutorials',
			genres
		}
		
		res.render('auto_grid_template', {layout: 'general_template', ...data});
	})

	router.get('/:genre', async (req, res) => {
		const folderName = req.params.genre;
		const folderPath = path.join(root, `public/tutorials/${folderName}`);

		try {
			tutorials = await fs.promises.readdir(folderPath, { withFileTypes: true })
			tutorials = tutorials.filter(files => files.isFile() && files.name.endsWith('.html'));
			tutorials = await Promise.all(tutorials.map(async files => {
				const file = files.name;
				const filePath = path.join(folderPath, file);
				const data = fs.readFileSync(filePath, 'utf-8');

				let title = null;
				const $ = cheerio.load(data);
				const titleMatch = $('title').text();
				if (titleMatch) title = titleMatch;
				else {
					const h1Match = $('h1').text();
					if (h1Match) title = h1Match;
				}
				if (!title) title = file.replace(".html", "");

				let description = null;
				const descMatch = $('meta[name="description"]').attr('content');
				if (descMatch) description = descMatch;

				const tutorial = file.replace(".html", "");
				return {
					title,
					description,
					link: `/tutorials/${folderName}/${file}`
				};
			}));

			const data = {
				title: `${i18next.t(`tutorials.${folderName}.title`)}`,
				heading: `${i18next.t(`tutorials.${folderName}.title`)}`,
				description: `${i18next.t(`tutorials.${folderName}.description`)}`,
				type: 'tutorials',
				genres: await Promise.all(tutorials)
			}

			res.render('auto_grid_template', {layout: 'general_template', ...data});
		} catch (err) {
			console.error('讀取 tutorials 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}
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