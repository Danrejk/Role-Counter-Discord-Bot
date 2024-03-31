const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
  if (err) return console.errror(err.message);
  console.log('database connection successful')
})

// db.run(`CREATE TABLE watchedRoles(roleId, guildId)`);
db.run(`DELETE FROM watchedRoles`)

db.close((err) => {
  if(err) return console.error(err.message)
})