const http = require("http");
const socketIO = require("socket.io");
const { logger } = require("./util");
const Routes = require("./routes.js");
const PORT = 3000;

const handler = (req, res) => {
  const defaultRoute = async (req, res) => res.end("Hello!");

  const routes = new Routes(io);
  const chosen = routes[req.method.toLowerCase()] || defaultRoute;

  return chosen.apply(routes, [req, res]);
};

const server = http.createServer(handler);
const io = socketIO(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

io.on("connection", (socket) => {
  logger.info("someone connected" + socket.id);
});

const startServer = () => {
  const { address, port } = server.address();
  logger.info(`app running at http://${address}:${port}`);
};

server.listen(PORT, startServer);
