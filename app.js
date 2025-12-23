// // import "dotenv/config";
// // import { connectDB } from "./src/config/connect.js";
// // import fastify from "fastify";
// // import { PORT } from "./src/config/config.js";
// // import fastifySocketId from "fastify-socket.io";
// // import { registerRoutes } from "./src/routes/index.js";
// // import { admin, buildAdminRouter } from "./src/config/setup.js";

// // const start = async () => {
// //   await connectDB(process.env.MONGO_URI);
// //   const app = fastify();

// //   app.register(fastifySocketId, {
// //     cors: {
// //       origin: "*",
// //     },
// //     pingIntervel: 10000,
// //     pingTimeout: 5000,
// //     transports: ["Websocket"],
// //   });

// //   await registerRoutes(app);

// //   await buildAdminRouter(app);

// //   app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
// //     if (err) {
// //       console.log(err);
// //     } else {
// //       console.log(
// //         `Shifa Store running on http://localhost:${PORT}${admin.options.rootPath}`
// //       );
// //     }
// //   });

// //   app.ready().then(() => {
// //     app.io.on("connection", (socket) => {
// //       console.log("A user Connected ✅");

// //       socket.on("jionRoom", (orderId) => {
// //         socket.join(orderId);
// //         console.log(`🔴 User Joined romm ${orderId}`);
// //       });

// //       socket.on("disconnect", () => {
// //         console.log("User Disconnected ❌");
// //       });
// //     });
// //   });
// // };

// // start();

// import Fastify from "fastify";
// import { Server } from "socket.io";

// const app = Fastify({ logger: true });

// // ---------- HTTP ROUTES ----------
// app.get("/", async () => {
//   return { status: "Fastify 5 + Socket.IO running 🚀" };
// });

// // ---------- START SERVER ----------
// const start = async () => {
//   try {
//     // Start Fastify server
//     await app.listen({ port: 3000, host: "0.0.0.0" });

//     // Attach Socket.IO directly to Fastify HTTP server
//     const io = new Server(app.server, {
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//       },
//     });

//     console.log("Socket.IO attached successfully ✅");

//     // ---------- SOCKET.IO EVENTS ----------
//     io.on("connection", (socket) => {
//       console.log("User connected ✅", socket.id);

//       socket.on("joinRoom", (orderId) => {
//         socket.join(orderId);
//         console.log(`🔴 User joined room ${orderId}`);
//       });

//       socket.on("orderUpdate", ({ orderId, status }) => {
//         io.to(orderId).emit("orderUpdate", {
//           orderId,
//           status,
//         });
//       });

//       socket.on("disconnect", () => {
//         console.log("User disconnected ❌", socket.id);
//       });
//     });
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };

// start();

import Fastify from "fastify"
import cookie from "@fastify/cookie"
import session from "@fastify/session"
import { Server } from "socket.io"

import { connectDB } from "./src/config/connect.js"
import { registerRoutes } from "./src/routes/index.js"
import { admin, buildAdminRouter } from "./src/config/setup.js"

const app = Fastify({ logger: true })

// 🔐 COOKIE (REQUIRED)
await app.register(cookie)

// 🔐 SESSION (REQUIRED FOR ADMIN LOGIN)
await app.register(session, {
  secret: process.env.COOKIE_PASSWORD, // MUST be >= 32 chars
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
  saveUninitialized: false,
})

// BASIC ROUTE
app.get("/", async () => ({
  status: "Fastify 5 + Socket.IO running 🚀",
}))

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    // REGISTER ROUTES
    await registerRoutes(app)

    // 🔑 REGISTER ADMINJS AFTER SESSION
    await buildAdminRouter(app)

    // START SERVER
    await app.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    })

    // SOCKET.IO
    const io = new Server(app.server, {
      cors: { origin: "*" },
    })

    console.log("Socket.IO attached ✅")
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

