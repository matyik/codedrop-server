module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1338),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "f8b52767bff29a7b55077fe95ac229ec"),
    },
  },
});
