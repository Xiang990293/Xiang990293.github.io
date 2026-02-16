const fs = require('fs').promises
const path = require('path')


async function ScanToolsFolder(current_path) {
	let sub_folder_queue = []
	let current_folder_queue = []
	let result = {files: []}
	result.length = 0

	try {
		const files = await fs.readdir(current_path);

		for (const File of files) {
			let file = File.toLowerCase()
			if (file.endsWith(".html"))
			{
				current_folder_queue.push(file)
				result.length += 1
				continue
			}

			if (file.search("\\.") !== -1) continue

			sub_folder_queue.push(file)
		}
		result.files = current_folder_queue

	} catch (err) {
		console.error("Error occurred with making recersive folder lists: ", err)
	}

	for (const Subfolder of sub_folder_queue) {
		try {
			let subfolder = Subfolder.toLowerCase()
			result[subfolder] = await ScanToolsFolder(path.join(current_path, subfolder))
			result.length += result[subfolder].length
		} catch (err) {
			console.error("Error occurred with making recersive folder lists: ", err)
		}
	}


	return result
}

module.exports = { ScanToolsFolder }