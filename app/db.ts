import { createPool } from "mysql2/promise";
import * as dotenv from "dotenv"

dotenv.config();

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    connectionLimit: 10,
    waitForConnections: true,
})

export default pool