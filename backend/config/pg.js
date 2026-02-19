import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "attendance_check",
  password: "123456",
  port: 5432,
});

export default pool;
