export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  PORT: process.env.NODE_PORT ?? 3000,
  SALT: process.env.CRYPTO_SALT ?? 12
}
