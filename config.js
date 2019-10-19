const config = {
  app: {
    port: process.env.APP_PORT,
    clientUrl: process.env.APP_CLIENTURL
  },
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  }
}

module.exports = config
