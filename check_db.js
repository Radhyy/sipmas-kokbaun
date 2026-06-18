const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=')[1].replace(/['"\r\n]/g, '');
const sql = require('@neondatabase/serverless').neon(env);
sql`SELECT id, bukti_url FROM pengaduan`.then(r => {
  fs.writeFileSync('db_out.txt', JSON.stringify(r, null, 2));
  console.log('Done');
});
