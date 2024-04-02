const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) =>{
  if (err) return console.errror(err.message);
  console.log('database connection successful')
})

// // Create the table if it doesn't exist
// db.run(`DROP TABLE updatedMessages`);
// db.run(`CREATE TABLE updatedMessages(guildId TEXT, channelId TEXT, threadId TEXT, countriesMessageId TEXT, city_statesMessageId TEXT, subjectsMessageId TEXT, organisationsMessageId TEXT, religionsMessageId TEXT)`);

// // Insert data into the table
// db.run(`INSERT INTO updatedMessages (channelId, messageId) VALUES (?, ?)`, ["test", "test2"], function(err) {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Data inserted successfully.');
//   }
// });

db.run(`DELETE FROM updatedMessages`)

// db.run(`ALTER TABLE updatedMessages ADD COLUMN threadId`)

db.close((err) => {
  if(err) return console.error(err.message)
})