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
			genres = await fs.promises.readdir(path.join(root, 'public/tools'), { withFileTypes: true });
			genres = genres.filter(dirent => dirent.isDirectory()).map(dirent => {
				const genre = dirent.name;
				const title = i18next.t(`tools.${genre}.title`) || genre;
				const description = i18next.t(`tools.${genre}.description`) || genre;
				return {
					genre,
					title,
					description,
					link: `/tools/${genre}`
				};
			});
		} catch (err) {
			console.error('讀取 tools 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}

		const data = {
			title: `${i18next.t(`tools.root.title`)} - 立方漣漪研究社`,
			heading: `${i18next.t('tools.root.title')}`,
			description: `${i18next.t('tools.root.description')}`,
			type: 'tools',
			genres
		}

		res.render('auto_grid_template', { layout: 'general_template', ...data });
	})


	router.get('/:genre', async (req, res) => {
		/*
			note:
			genre is a folder name under public/tools
			and the page list out all html files in public/tools/<genre>/
			but auto_grid_template needs the parameters to be in the form of {title, heading, description, type, genres}
			where genres is a list of {genre, title, description, link}

			in this case, "genre" is the tool name, instead of <genre> name.
			tool name is under public/tools/<genre>/
			so public/tools/<genre>/"genre".
		*/

		const folderName = req.params.genre;
		const folderPath = path.join(root, `public/tools/${folderName}`);

		try {
			tools = await fs.promises.readdir(folderPath, { withFileTypes: true })
			tools = tools.filter(files => files.isFile() && files.name.endsWith('.html'));
			tools = await Promise.all(tools.map(async files => {
				const file = files.name;
				const filePath = path.join(folderPath, file);

				const data = await fs.promises.readFile(filePath, 'utf-8');
				const $ = cheerio.load(data);

				// 用 DOM 方式抓 title
				let title = null;
				const titleEl = $('title').text().trim();
				if (titleEl) title = titleEl;

				// 若沒有 title，再用 h1
				if (!title) {
					const h1El = $('h1').text().trim();
					if (h1El) title = h1El;
				}

				if (!title) title = files.name.replace(".html", "");

				let description = null;
				const descEl = $('meta[name="description"]').attr('content');
				if (descEl) description = descEl;

				if (!description) description = title.replace(".html", "") + `的工具`;

				const tool = file.replace('.html', '');
				return {
					genre: tool,
					title,
					description,
					link: `/tools/${folderName}/${tool}`
				};
			}));
		} catch (err) {
			console.error('讀取 tools 目錄失敗:', err);
			return res.status(500).send('伺服器錯誤');
		}

		const data = {
			title: `${i18next.t(`tools.${folderName}.title`)}`,
			heading: `${i18next.t(`tools.${folderName}.title`)}`,
			description: `${i18next.t(`tools.${folderName}.description`)}`,
			type: 'tools',
			genres: await Promise.all(tools)
		}

		res.render('auto_grid_template', { layout: 'general_template', ...data });
	});


	router.get('/:genre/:name', (req, res) => {
		const genre = req.params.genre;
		const toolName = req.params.name;

		const page = path.join(root, `public/tools/${genre}/${toolName}.html`);

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
				if (!title) title = toolName.replace(".html", "");

				let description = null;
				const descMatch = data.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i);
				if (descMatch) description = descMatch[1];

				if (!description) description = title.replace(".html", "") + `的工具`;

				// console.log(`${file.replace(".html","")}`);
				resolve({ name: toolName.replace(".html", ""), title, description });
			});
		}).then(details => {

			data = {
				heading: details.title,
				title: `${genre} - ${details.title}`,
				body: fs.readFileSync(path.join(root, `public/tools/${genre}/${toolName}.html`), 'utf8')
			}

			res.render('general_template', data);
		}).catch((err) => {
			res.status(404).send('找不到該工具' + err);
		});
	});


	// const {pi} = require('pi-calculator');
	// sorry but let me copy your code prevent auto calculating
	const { pi_calculate } = require(path.resolve(root, './modules/next-pi-calculator.js'))(root);
	// let lastCalculated = 10000;
	router.get('/query/pi/:num', (req, res) => {
		const num = req.params.num;

		// res.send(calculate(Number(num)));
		pi_calculate(Number(num)).then(result => {
			res.send(result);
		});

	});

	const { e_calculate } = require(path.resolve(root, './modules/next-e-calculator.js'))(root);
	// let lastCalculated = 10000;
	router.get('/query/e/:num', (req, res) => {
		const num = req.params.num;

		// res.send(calculate(Number(num)));
		e_calculate(Number(num)).then(result => {
			console.log(result);
			res.send(result);
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