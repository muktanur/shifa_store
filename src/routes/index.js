// import { authRoutes } from "./auth.js";
// import { orderRoutes } from "./order.js";
// import { categoryRoutes, productRoutes } from "./products.js";

// const prefix = "/api";

// export const registerRoutes = async (fastify) => {
//   fastify.register(authRoutes, { prefix: prefix });
//   fastify.register(productRoutes, { prefix: prefix });
//   fastify.register(categoryRoutes, { prefix: prefix });
//   fastify.register(orderRoutes, { prefix: prefix });
// };

import { authRoutes } from "./auth.js";
import { orderRoutes } from "./order.js";
import { categoryRoutes, productRoutes } from "./products.js";

export const registerRoutes = async (fastify) => {
  // User & Auth
  fastify.register(authRoutes);

  // Product & Category
  fastify.register(productRoutes);
  fastify.register(categoryRoutes);

  // Orders
  fastify.register(orderRoutes);
};
