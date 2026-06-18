import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);

async function createAdminTable() {
  try {
    // Create the table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Table 'admin_users' created successfully.");

    // Check if admin already exists
    const existingAdmins = await sql`SELECT * FROM admin_users WHERE username = 'admin'`;
    
    if (existingAdmins.length === 0) {
      // Create default admin: admin / rahasia123
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('rahasia123', salt);
      
      await sql`
        INSERT INTO admin_users (username, password_hash) 
        VALUES ('admin', ${hash})
      `;
      console.log("Default admin account created. Username: admin, Password: rahasia123");
    } else {
      console.log("Admin account already exists. Skipping insertion.");
    }
    
  } catch (err) {
    console.error("Error setting up admin db:", err);
  }
}

createAdminTable();
