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

		res.render('auto_grid_template', { layout: 'general_template', ...data });
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
				const $ = cheerio.load(data);
				let title = null;
				const titleMatch = $('title').text().trim();
				if (titleMatch) title = titleMatch;
				else {
					const h1Match = $('h1').text().trim();
					if (h1Match) title = h1Match;
				}
				if (!title) title = file.replace(".html", "");

				let description = null;
				const descMatch = $('meta[name="description"]').attr('content');
				if (descMatch) description = descMatch;

				const tutorial = file.replace(".html", "");
				return {
					genre: tutorial,
					title,
					description,
					link: `/tutorials/${folderName}/${tutorial}`
				};
			}));

			const data = {
				title: `${i18next.t(`tutorials.${folderName}.title`)}`,
				heading: `${i18next.t(`tutorials.${folderName}.title`)}`,
				description: `${i18next.t(`tutorials.${folderName}.description`)}`,
				type: 'tutorials',
				genres: await Promise.all(tutorials)
			}

			res.render('auto_grid_template', { layout: 'general_template', ...data });
		} catch (err) {
			console.error('讀取 tutorials 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}
	});

	router.get('/:genre/:name', (req, res) => {
		const genre = req.params.genre;
		const tutorial = req.params.name;

		const page = path.join(root, `public/tutorials/${genre}/${tutorial}.html`);
		let data = null;

		try {
			file = fs.readFileSync(page, 'utf-8')
			const $ = cheerio.load(file);
			const title = $('title').text() || $('h1').text() || tutorial.replace(".html", "");
			const description = $('meta[name="description"]').attr('content') || title.replace(".html", "") + `的教程`;

			data = {
				heading: title,
				title,
				description,
				body: file
			};

		} catch (err) {
			console.error('讀取 tutorials 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}

		res.render('direct_body', {layout: "general_template", ...data});
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