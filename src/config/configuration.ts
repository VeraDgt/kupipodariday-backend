export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    username: process.env.DB_USERNAME || 'student',
    password: process.env.DB_PASSWORD || 'student',
    databaseName: process.env.DB_NAME || 'nest_project',
    synchronize: process.env.SYNCHRONIZE || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'bolshoy_secret',
    ttl: parseInt(process.env.JWT_TTL) || '30000s',
  },
  hash: {
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  },
});
