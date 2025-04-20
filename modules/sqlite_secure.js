const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (root) => {
	console.log("正在載入 sqlite_secure")
	const toroot = require('./toroot.js')(root);
	const securedb = new sqlite3.Database(toroot("./secure/secure.sqlite"), (err) => {
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
		hashpassword TEXT NOT NULL,
		power INT DEFAULT 0
	);`)

	// 取得使用者
	function getUserById(id, callback) {
		securedb.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
			callback(err, row);
		});

	}
	function getUserbyUsername(username, callback) {
		securedb.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
			if (err) {
				return callback(err);
			}
			callback(null, row);
		});
	}

	async function addUser(user, callback) {
		securedb.run('INSERT INTO users(username, email, hashpassword) VALUES(?, ?)', [user.username, user.email, user.hashPassword], function (err) {
			if (err) {
				console.error(err.message);
			} else {
				console.log(`使用者 ${username} 已新增`);
			}
			callback(err, this.lastID);
		});
	}

	// 更新使用者
	async function updateUserEmail(username, email, callback) {
		return Promise((resolve, reject) => {
			securedb.run(`UPDATE users SET email = ? WHERE username = ?;`, [email, username], function (err) {
				if (err) {
					reject(err.message);
					return;
				} else {
					resolved(`使用者 ${username} 電子郵件已更新`);
					return;
				}
				callback(err, this.lastID);
			});
		})
	}
	async function updateUserPassword(username, newPassword, oldPassword) {
		if (!await verifyPassword(username, oldPassword)) return Promise((resolve, reject) => reject("舊密碼錯誤"))
		const hashPassword = await storedHashPassword(newPassword);
		return Promise((resolve, reject) => {

			securedb.run(`UPDATE users SET hashpassword = ? WHERE username = ?;`, [hashPassword, username], function (err) {
				if (err) {
					reject(err.message);
					return;
				}
				resolve(`使用者 ${username} 密碼已更新`);
				return;
			});
		})
	}

	async function updateUserInfo(username, info, callback) {
		return Promise((resolve, reject) => {
			securedb.run(`UPDATE users SET info = ? WHERE username = ?;`, [info, username], function (err) {
				if (err) {
					reject(err.message);
					return;
				}
				resolve(`使用者 ${username} 簡介已更新`);
				return;
			});
		})
	}

	async function updateUserName(username, callback) {
		securedb.run(`UPDATE users SET username = ? WHERE username = ?;`, [userdata.usernameUpdated, userdata.username], function (err) {
			if (err) {
				console.error(err.message);
			} else {
				console.log(`使用者 ${username} 簡介已更新`);
			}
			callback(err, this.lastID);
		});
	}

	async function storedHashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  }

	async function verifyPassword(username, plainPassword) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT hashpassword FROM users WHERE username = ?', [username], (err, hash) => {
				if (err) {
					reject(err);
					return;
				}

				if (hash == undefined) {
					reject(new Error("username not found"));
					return;
				}

				bcrypt.compare(plainPassword, hash, (err, result) => {
					if (err) {
						reject(err);
						return;
					}

					if (result == undefined) {
						reject(new Error("username not found"));
						return;
					}
					resolve(result); // t/f
					return;
				});
			})
		})

	}

	async function checkEmail(email) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT email FROM users WHERE email = ?', [email], (err, email) => {
				if (err) {
					reject(err);
					return;
				}

				if (email == undefined) {
					resolve(false);
					return;
				}

				resolve(true); // t/f
				return;
			})
		})
	}

	console.log("已載入 sqlite_secure")

	return {
		getUserById,
		addUser,
		getUserbyUsername,
		updateUserEmail,
		updateUserInfo,
		updateUserPassword,
		updateUserName,
		verifyPassword,
		storedHashPassword,
		checkEmail
		// 其他資料庫操作函式
	};
}

/*
access database as admin
app.get('/admin/database', (req, res) => {
	const query = req.query
	db1.get(`SELECT * FROM `, [], (err, row) => {
		if (err) {
			return res.status(500).send('Database error');
		}
		// 使用 db2 進行其他操作
		db2.get('SELECT * FROM tableB', [], (err, row2) => {
			if (err) {
				return res.status(500).send('Database error');
			}
			res.json({ data1: row, data2: row2 });
		});
	});
});
*/

// access dataabase like this
/*

// get method
db.get('SELECT "count" from "welcome"', (err, row) => {
	let query = 'UPDATE "welcome" SET "count" = ?'

	if (err) {
		reject(err)
		return
	}
    
	if (row) {
		count = row.count + 1
	} else {
		count = 1
		query = 'INSERT INTO "welcome" VALUES(?)'
	}

	db.run(query, [count], err => {
	err ? reject(err) : resolve()
	})
})

*/