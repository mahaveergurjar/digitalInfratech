require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { prepareMailTransport } = require("./services/mail.service");

function getPreferredPort(portValue = process.env.PORT || 5000) {
  const parsed = Number(portValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 5000;
  }
  return parsed;
}

function listenWithFallback(
  appInstance,
  initialPort,
  { maxAttempts = 10, logger = console } = {},
) {
  return new Promise((resolve, reject) => {
    const attempt = (port, attemptNumber) => {
      const server = appInstance.listen(port, () => {
        resolve(server);
      });

      server.once("error", (err) => {
        if (err && err.code === "EADDRINUSE" && attemptNumber < maxAttempts) {
          logger.warn(`Port ${port} is busy. Trying ${port + 1} instead.`);
          attempt(port + 1, attemptNumber + 1);
          return;
        }
        reject(err);
      });
    };

    attempt(getPreferredPort(initialPort), 0);
  });
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

async function start() {
  try {
    await connectDB();
    await prepareMailTransport();
    const server = await listenWithFallback(app, process.env.PORT || 5000);
    const address = server.address();
    const actualPort =
      address && typeof address === "object"
        ? address.port
        : process.env.PORT || 5000;

    console.log(`Backend running on http://localhost:${actualPort}`);
    console.log(`API: http://localhost:${actualPort}/api`);
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = {
  getPreferredPort,
  listenWithFallback,
  start,
};
