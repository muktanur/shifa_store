import {
    fetchUser,
    loginCustomer,
    loginDeliveryPartner,
    registerCustomer,
    loginShopOwner,
    refreshToken,
  } from "../controllers/auth/auth.js";
import { updateUser } from "../controllers/tracking/user.js";
import { verifyToken } from "../middleware/auth.js";

export const authRoutes = async (fastify, options) => {
    fastify.post("/customer/signup", registerCustomer);
    fastify.post("/customer/login", loginCustomer);
    fastify.post("/delivery/login", loginDeliveryPartner);
    fastify.post("/shop/login", loginShopOwner);
    fastify.post("/refresh-token", refreshToken);
    fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
    fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
};