import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
});

const _initDb = async () => {
  await sql`
CREATE TYPE admin_level AS ENUM ('country', 'state', 'city');
  `;
  await sql`
CREATE TABLE locations (
  name 	        TEXT PRIMARY KEY NOT NULL,
  population    BIGINT NOT NULL,
  location_type admin_level NOT NULL,
  parent        TEXT REFERENCES locations(name)
);
  `;

  await sql`
INSERT INTO locations (name, parent, population, location_type) VALUES
  ('United States', NULL, 329500000, 'country'),
  ('Australia', NULL, 25690000, 'country'),
  ('Spain', NULL, 47350000, 'country'),
  ('Texas', 'United States', 29000000, 'state'),
  ('California', 'United States', 39510000, 'state'),
  ('New South Wales', 'Australia', 8166000, 'state'),
  ('Victoria', 'Australia', 6681000, 'state'),
  ('Comunidad de Madrid', 'Spain', 6642000, 'state'),
  ('Dallas', 'Texas', 1331000, 'city'),
  ('Austin', 'Texas', 950807, 'city'),
  ('Houston', 'Texas', 2310000, 'city'),
  ('Los Angeles', 'California', 3967000, 'city'),
  ('San Francisco', 'California', 874961, 'city'),
  ('San Diego', 'California', 1410000, 'city'),
  ('Sydney', 'New South Wales', 5312000, 'city'),
  ('Newcastle', 'New South Wales', 322278, 'city'),
  ('Melbourne', 'Victoria', 5078000, 'city'),
  ('Geelong', 'Victoria', 253269, 'city'),
  ('Madrid', 'Comunidad de Madrid', 3223000, 'city'),
  ('M├│stoles', 'Comunidad de Madrid', 207095, 'city');
  `;
};

const getParents = async (name: string): Promise<string[]> => {
  type Ansestors = {
    parents: string[] | null;
  };
  const [{ parents }] = await sql<Ansestors[]>`
WITH RECURSIVE locations_cte(name, parent, parents) AS (
  SELECT
    locations.name, 
    locations.parent,
    ARRAY[locations.name::TEXT] as parents
  FROM
    locations
  WHERE
    locations.name = ${name}
  UNION ALL
  SELECT
    locations.name, 
    locations.parent,
    ARRAY_APPEND(locations_cte.parents, locations.name::TEXT)
  FROM
    locations_cte,
    locations
  WHERE
    locations.name = locations_cte.parent
)
SELECT
  parents
FROM
  locations_cte
WHERE
  parent IS NULL
;
  `;
  return parents ?? [];
};

(async () => {
  type NowRow = {
    now: Date;
  };
  const [{ now }] = await sql<NowRow[]>`SELECT NOW()`;
  console.log(now);

  // await initDb();

  const parents = await getParents('Austin');
  console.log(parents);
})();
