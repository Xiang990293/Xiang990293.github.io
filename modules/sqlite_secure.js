const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');

module.exports = (root) => {
	console.log("正在載入 sqlite_secure")
	const toroot = require('./toroot.js')(root);
	const dbDir = "/database";
	if (!fs.existsSync(dbDir)) {
		fs.mkdirSync(dbDir);
	}
	const securedb = new sqlite3.Database(toroot("./database/secure.sqlite"), (err) => {
		if (err) {
			console.error('連接至安全資料庫時發生問題：', err.message);
		} else {
			console.log('已連接至安全資料庫');
		}
	});

	securedb.run(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE NOT NULL,
		email TEXT UNIQUE NOT NULL,
		hashpassword TEXT NOT NULL,
		power INTEGER DEFAULT 0
	);`)

	securedb.run(`CREATE TABLE IF NOT EXISTS verifying_email (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		token TEXT NOT NULL,
		expire INTEGER DEFAULT 600000
	);`)

	// 取得使用者
	function getUsernameById(id) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT username FROM users WHERE id = ?', [id], (err, row) => {
				if (err) {
					reject(err.message);
					return;
				}
				if (row == undefined) {
					reject("id not found");
					return;
				}
				resolve(row.username);
				return;
			});
		});
	}

	function getIdbyEmail(email) {
		return new Promise((resolve, reject) => {
			securedb.get(`SELECT id FROM users WHERE email = ?`, [email], (err, row) => {
				if (err) {
					reject(err);
					return;
				}
				if (row == undefined) {
					reject("email not found");
					return;
				}
				resolve(row.id);
				return;
			});
		});
	}

	async function addUser(username, email, plainPassword) {
		const hashPassword = await storedHashPassword(plainPassword)
		return new Promise((resolve, reject) => {
			securedb.run('INSERT INTO users(username, email, hashpassword) VALUES(?, ?, ?)', [username, email, hashPassword], function (err) {
				if (err) {
					reject(err.message);
					return;
				}
				resolve(`使用者 ${username} 已新增`);
				return;
			});
		});
	}

	// 更新使用者
	async function updateUserEmail(username, email, callback) {
		return new Promise((resolve, reject) => {
			securedb.run(`UPDATE users SET email = ? WHERE username = ?;`, [email, username], function (err) {
				if (err) {
					reject(err.message);
					return;
				} else {
					resolve(`使用者 ${username} 電子郵件已更新`);
					return;
				}
				callback(err, this.lastID);
			});
		})
	}
	async function updateUserPassword(username, newPassword, oldPassword) {
		if (!await verifyPassword(username, oldPassword)) return new Promise((resolve, reject) => reject("舊密碼錯誤"))
		const hashPassword = await storedHashPassword(newPassword);
		return new Promise((resolve, reject) => {

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

	async function updateUserPasswordWithEmail(email, newPassword) {
		const hashPassword = await storedHashPassword(newPassword);
		return new Promise((resolve, reject) => {
			securedb.run(`UPDATE users SET hashpassword = ? WHERE email = ?;`, [hashPassword, email], function (err) {
				if (err) {
					reject(err.message + ", at updateUserPasswordWithEmail");
					return;
				}
				resolve(`使用者 ${email} 密碼已更新`);
				return;
			});
		})
	}

	function updateUserInfo(username, info) {
		return new Promise((resolve, reject) => {
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

	function updateUserName(username, usernameUpdated) {
		securedb.run(`UPDATE users SET username = ? WHERE username = ?;`, [usernameUpdated, username], function (err) {
			if (err) {
				console.error(err.message);
			} else {
				console.log(`使用者 ${username} 已更新為 ${usernameUpdated}`);
			}
			callback(err, this.lastID);
		});
	}

	async function storedHashPassword(plainPassword) {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(plainPassword, salt);
		return hash;
	}

	function verifyPassword(username, plainPassword) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT hashpassword, id FROM users WHERE username = ?', [username], (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (row == undefined) {
					reject("username not found");
					return;
				}

				const hash = row.hashpassword
				bcrypt.compare(`${plainPassword}`, `${hash}`, (err, result) => {
					if (err) {
						reject(err);
						return;
					}

					if (result == undefined) {
						reject("username not found");
						return;
					}

					resolve({success: result, userid: row.id}); // t/f
					return;
				});
			})
		})

	}

	function checkEmail(email) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT email FROM users WHERE email = ?', [email], (err, email) => {
				if (err) {
					reject(err);
					return;
				}

				if (email != undefined) {
					resolve(true);
					return;
				}

				resolve(false); // t/f
				return;
			})
		})
	}

	function checkUsernameAndEmailPair(username, email) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT email FROM users WHERE username = ?', [username], (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (email == undefined) {
					reject("email not found");
					return;
				}

				if (username == undefined) {
					reject("username not found");
					return;
				}

				if (row == undefined) {
					reject("email not found");
					return;
				}

				if (row.email == undefined) {
					reject("email not found");
					return;
				}

				if (row.email != email) {
					resolve(false);
					return;
				}

				resolve(true);
				return;
			})
		})
	}

	function saveVerifyingEmailToken(email, token, expire) {
		return new Promise((resolve, reject) => {
			securedb.run('INSERT OR REPLACE INTO verifying_email(email, token, expire) VALUES(?, ?, ?)', [email, token, expire], function (err) {
				if (err) {
					reject(err.message);
					return;
				}
				resolve(`等待使用者接收驗證信件`);
				return;
			});
		})
	}

	function getEmailByToken(token) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT email FROM verifying_email WHERE token = ?', [token], function (err, row) {
				if (err) {
					reject(err.message + ", at getEmailByToken");
					return;
				}
				resolve(row.email);
				return;
			});
		})
	}

	function getResetToken(token) {
		return new Promise((resolve, reject) => {
			securedb.get('SELECT * FROM verifying_email WHERE token = ?', [token], function (err, row) {
				if (err) {
					reject(err.message + ", at getResetToken");
					return;
				}

				if (!row) {
					reject("token not found")
				}
				resolve(row);
				return;
			});
		})
	}

	function deleteVerifyingEmailToken(token) {
		return new Promise((resolve, reject) => {
			securedb.run('DELETE FROM verifying_email WHERE token = ?', [token], function (err) {
				if (err) {
					reject(err.message + ", at deleteVerifyingEmailToken");
					return;
				}
				resolve(`驗證成功`);
				return;
			});
		})
	}

	console.log("已載入 sqlite_secure")

	return {
		getUsernameById,
		addUser,
		getIdbyEmail,
		updateUserEmail,
		updateUserPasswordWithEmail,
		updateUserInfo,
		updateUserPassword,
		updateUserName,
		verifyPassword,
		storedHashPassword,
		checkEmail,
		checkUsernameAndEmailPair,
		saveVerifyingEmailToken,
		deleteVerifyingEmailToken,
		getEmailByToken,
		getResetToken
	}
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