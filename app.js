// import "dotenv/config";
// import { connectDB } from "./src/config/connect.js";
// import fastify from "fastify";
// import { PORT } from "./src/config/config.js";
// import fastifySocketId from "fastify-socket.io";
// import { registerRoutes } from "./src/routes/index.js";
// import { admin, buildAdminRouter } from "./src/config/setup.js";

// const start = async () => {
//   await connectDB(process.env.MONGO_URI);
//   const app = fastify();

//   app.register(fastifySocketId, {
//     cors: {
//       origin: "*",
//     },
//     pingIntervel: 10000,
//     pingTimeout: 5000,
//     transports: ["Websocket"],
//   });

//   await registerRoutes(app);

//   await buildAdminRouter(app);

//   app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(
//         `Shifa Store running on http://localhost:${PORT}${admin.options.rootPath}`
//       );
//     }
//   });

//   app.ready().then(() => {
//     app.io.on("connection", (socket) => {
//       console.log("A user Connected ✅");

//       socket.on("jionRoom", (orderId) => {
//         socket.join(orderId);
//         console.log(`🔴 User Joined romm ${orderId}`);
//       });

//       socket.on("disconnect", () => {
//         console.log("User Disconnected ❌");
//       });
//     });
//   });
// };

// start();


import 'dotenv/config'
import Fastify from 'fastify'
import websocket from '@fastify/websocket'

import { connectDB } from './src/config/connect.js'
import { PORT } from './src/config/config.js'
import { registerRoutes } from './src/routes/index.js'
import { admin, buildAdminRouter } from './src/config/setup.js'
import { joinRoom, leaveAllRooms } from './src/utils/wsRooms.js'

const start = async () => {
  await connectDB(process.env.MONGO_URI)

  const app = Fastify({ logger: true })

  // WebSocket plugin
  await app.register(websocket)

  // HTTP routes
  await registerRoutes(app)

  // AdminJS
  await buildAdminRouter(app)

  // WebSocket endpoint
  app.get('/ws', { websocket: true }, (connection) => {
    const socket = connection.socket

    console.log('A user Connected ✅')

    socket.on('message', (data) => {
      try {
        const payload = JSON.parse(data.toString())

        if (payload.event === 'joinRoom') {
          joinRoom(payload.orderId, socket)
          console.log(`🔴 User joined room ${payload.orderId}`)
        }
      } catch (err) {
        console.error('Invalid WebSocket message')
      }
    })

    socket.on('close', () => {
      leaveAllRooms(socket)
      console.log('User Disconnected ❌')
    })
  })

  await app.listen({ port: PORT, host: '0.0.0.0' })

  console.log(
    `Shifa Store running on http://localhost:${PORT}${admin.options.rootPath}`
  )
}

start()
