import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
});

(async () => {
  const [{ now }] = await sql`SELECT NOW()`;
  console.log(now);
})();
