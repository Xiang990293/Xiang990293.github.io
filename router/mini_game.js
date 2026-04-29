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

		res.render('auto_grid_template', { layout: 'general_template', ...data });
	})

	router.get('/:genre', async (req, res) => {
		const folderName = req.params.genre;
		const folderPath = path.join(root, `public/mini_game/${folderName}`);

		try {
			games = await fs.promises.readdir(folderPath, { withFileTypes: true });
			games = games.filter(files => files.isFile() && files.name.endsWith('.html'));
			games = await Promise.all(games.map(async files => {
				const file = files.name;
				const filePath = path.join(folderPath, file);

				const data = await fs.promises.readFile(filePath, 'utf-8');
				const $ = cheerio.load(data);

				let title = null;
				const titleEl = $('title').text();
				if (titleEl) title = titleEl;

				// 若沒有 title，再用 h1
				if (!title) {
					const h1El = $('h1').text().trim();
					if (h1El) title = h1El;
				}

				if (!title) title = file.replace('.html', '');

				let description = null;

				const descEl = $('meta[name="description"]').attr('content');
				if (descEl) description = descEl;

				if (!description) description = title.replace(".html", "") + `的工具`;

				const game = file.replace('.html', '');

				return {
					genre: game,
					title,
					description,
					link: `/mini_game/${folderName}/${game}`
				}
			}));
		} catch (err) {
			console.error('讀取 mini_game 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}

		const data = {
			title: `${i18next.t(`mini_game.${folderName}.title`)} - 立方漣漪研究社`,
			heading: `${i18next.t(`mini_game.${folderName}.title`)}`,
			description: `${i18next.t(`mini_game.${folderName}.description`)}`,
			type: 'mini_game',
			genres: games
		}

		res.render('auto_grid_template', { layout: 'general_template', ...data });

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