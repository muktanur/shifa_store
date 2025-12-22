import "dotenv/config";
import { connectDB } from "./src/config/connect.js";
import fastify from "fastify";
import { PORT } from "./src/config/config.js";
import fastifySocketId from "fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = fastify();

  app.register(fastifySocketId, {
    cors: {
      origin: "*",
    },
    pingIntervel: 10000,
    pingTimeout: 5000,
    transports: ["Websocket"],
  });

  await registerRoutes(app);

  await buildAdminRouter(app);

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Shifa Store running on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A user Connected ✅");

      socket.on("jionRoom", (orderId) => {
        socket.join(orderId);
        console.log(`🔴 User Joined romm ${orderId}`);
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected ❌");
      });
    });
  });
};

start();
