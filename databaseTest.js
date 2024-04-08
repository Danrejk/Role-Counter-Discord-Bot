const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
  if (err) return console.errror(err.message);
  console.log('database connection successful')
})

// // Create the table if it doesn't exist
// db.run(`DROP TABLE updatedMessages`);
// db.run(`CREATE TABLE updatedMessages(guildId TEXT, channelId TEXT, threadId TEXT, countriesMessageId TEXT, city_statesMessageId TEXT, subjectsMessageId TEXT, organisationsMessageId TEXT, religionsMessageId TEXT)`);

// db.run(`DELETE FROM watchedRoles WHERE guildId NOT LIKE "696626298881310730"`)
db.run(`DELETE FROM updatedMessages WHERE guildId NOT LIKE "696626298881310730"`)

db.close((err) => {
  if(err) return console.error(err.message)
})