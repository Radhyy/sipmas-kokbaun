import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pengaduan (
        id SERIAL PRIMARY KEY,
        nomor_pengaduan VARCHAR(50) UNIQUE,
        tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        nama VARCHAR(100),
        nik VARCHAR(20),
        hp VARCHAR(20),
        alamat TEXT,
        kategori VARCHAR(100),
        lokasi VARCHAR(100),
        uraian TEXT,
        bukti_url TEXT,
        pernyataan BOOLEAN
      );
    `;
    console.log("Table 'pengaduan' created successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

createTable();
