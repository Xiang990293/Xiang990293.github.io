// # ipynb to html
// Convert all .ipynb files in /notebooks
const ipynb = require('ipynb2html');
const { Document } = require("nodom");
const fs = require("fs");

module.exports = (root) => {
	console.log("正在載入 ipynb_to_html")
	const toroot = require('./toroot.js')(root);
	fs.readdirSync(toroot('./notebooks')).forEach(file => {
		if (file.endsWith('.ipynb')) {
			// Create a DOM document instance
			const document = new Document();
			const renderNotebook = ipynb.createRenderer(document)
			const notebook = JSON.parse(fs.readFileSync(`${toroot('./notebooks')}/${file}`, 'utf8'));
			const html = renderNotebook(notebook).outerHTML;
			fs.writeFileSync(`${toroot('./code_tutorial')}/${file.replace('.ipynb', '.html')}`, html);
		}
	});
	console.log("已載入 ipynb_to_html")
}
