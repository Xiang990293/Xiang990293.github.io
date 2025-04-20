const path = require('path');

module.exports = (root) => (relative_path) => path.join(root, relative_path);