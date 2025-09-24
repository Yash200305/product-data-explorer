import 'dotenv/config';
import { DataSource } from 'typeorm';

// If you use a custom naming strategy, import and add it here
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Use compiled JS paths for CLI/runtime
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
  // namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: false,
});

export default AppDataSource;
