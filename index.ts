import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
});

(async () => {
  type NowRow = {
    now: Date;
  };
  const [{ now }] = await sql<NowRow[]>`SELECT NOW()`;
  console.log(now);
})();
