const sqlite3 = require('sqlite3').verbose();

module.exports = (root) => {
	console.log("正在載入 sqlite_secure")
	const toroot = require('./toroot.js')(root);
	const securedb = new sqlite3.Database(toroot("./secure.sqlite"), (err) => {
		if (err) {
			console.error('連接至安全資料庫時發生問題：', err.message);
		} else {
			console.log('已連接至安全資料庫');
		}
	});

	securedb.run(`CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		email TEXT UNIQUE NOT NULL UNIQUE,
		password TEXT NOT NULL,
		power INT DEFAULT 0
	);`)

	function getUserById(id, callback) {
		securedb.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
			callback(err, row);
		});
	}

	function addUser(user, callback) {
		securedb.run('INSERT INTO users(username, email) VALUES(?, ?)', [user.username, user.email], function (err) {
			callback(err, this.lastID);
		});
	}

	module.exports = {
		getUserById,
		addUser,
		// 其他資料庫操作函式
	};

	// 儲存使用者
	async function saveUser(username, plainPassword) {
		const hash = await hashPassword(plainPassword);
		securedb.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, hash], function (err) {
			if (err) {
				console.error(err.message);
			} else {
				console.log(`使用者 ${username} 已儲存`);
			}
		});
	}

	// 取得使用者
	function getUser(username, callback) {
		securedb.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
			if (err) {
				return callback(err);
			}
			callback(null, row);
		});
	}

	
	console.log("已載入 sqlite_secure")
}


// access database as admin
// app.get('/admin/database', (req, res) => {
//     const query = req.query
//     db1.get(`SELECT * FROM `, [], (err, row) => {
//       if (err) {
//         return res.status(500).send('Database error');
//       }
//       // 使用 db2 進行其他操作
//       db2.get('SELECT * FROM tableB', [], (err, row2) => {
//         if (err) {
//           return res.status(500).send('Database error');
//         }
//         res.json({ data1: row, data2: row2 });
//       });
//     });
//   });