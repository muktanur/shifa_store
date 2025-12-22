// import { Customer, DeliveryPartner, ShopOwner } from "../../models/user.js";
// import jwt from "jsonwebtoken";
// import Shop from "../../models/shop.js";

// const generateTokens = (user) => {
//   const accessToken = jwt.sign(
//     { userId: user._id, role: user.role },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "1d" }
//   );

//   const refreshToken = jwt.sign(
//     { userId: user._id, role: user.role },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: "7d" }
//   );
//   return { accessToken, refreshToken };
// };

// export const loginCustomer = async (req, reply) => {
//   try {
//     const { phone, password } = req.body;

//     if (!phone || !password) {
//       return reply.status(400).send({
//         message: "Phone and password are required",
//       });
//     }

//     const customer = await Customer.findOne({ phone });

//     if (!customer) {
//       return reply.status(404).send({
//         message: "Customer not found",
//       });
//     }

//     const isMatch = password === customer.password;

//     if (!isMatch) {
//       return reply.status(400).send({
//         message: "Invalid Credentials",
//       });
//     }

//     const { accessToken, refreshToken } = generateTokens(customer);

//     return reply.send({
//       message: "Login Successful",
//       accessToken,
//       refreshToken,
//       customer,
//     });
//   } catch (error) {
//     console.error("Customer login error", error);
//     return reply.status(500).send({ message: "An error occurred", error });
//   }
// };

// export const registerCustomer = async (req, reply) => {
//   try {
//     const { name, phone, password, address, latitude, longitude } = req.body;

//     if (!name || !phone || !password) {
//       return reply
//         .status(400)
//         .send({ message: "Name, phone and password are required" });
//     }

//     if (password.length < 8) {
//       return reply
//         .status(400)
//         .send({ message: "Password must be at least 8 characters long" });
//     }

//     const existing = await Customer.findOne({ phone });
//     if (existing) {
//       return reply.status(409).send({ message: "Phone already registered" });
//     }

//     // ⚠️ Plain-text password — no hashing
//     const customer = new Customer({
//       name,
//       phone,
//       password,
//       address: address || "",
//       liveLocation: {
//         latitude: latitude || 0,
//         longitude: longitude || 0,
//       },
//       role: "Customer",
//       isActivated: true,
//     });

//     await customer.save();

//     const { accessToken, refreshToken } = generateTokens(customer);

//     return reply.send({
//       message: "Signup Successful",
//       accessToken,
//       refreshToken,
//       customer,
//     });
//   } catch (error) {
//     console.error("Register customer error", error);
//     return reply.status(500).send({ message: "An error occurred", error });
//   }
// };

// export const loginDeliveryPartner = async (req, reply) => {
//   try {
//     const { email, password } = req.body;
//     const deliveryPartner = await DeliveryPartner.findOne({ email });

//     if (!deliveryPartner) {
//       return reply.status(404).send({ message: "Delivery Partner not found" });
//     }

//     const isMatch = password === deliveryPartner.password;

//     if (!isMatch) {
//       return reply.status(400).send({ message: "Invalid Credentials" });
//     }

//     const { accessToken, refreshToken } = generateTokens(deliveryPartner);

//     return reply.send({
//       message: "Login Successful",
//       accessToken,
//       refreshToken,
//       deliveryPartner,
//     });
//   } catch (error) {
//     return reply.status(500).send({ message: "An error occurred", error });
//   }
// };

// export const loginShopOwner = async (req, reply) => {
//   try {
//     const { email, password } = req.body;
//     const shopOwner = await ShopOwner.findOne({ email });

//     if (!shopOwner) {
//       return reply.status(404).send({ message: "Shop Owner not found" });
//     }

//     const isMatch = password === shopOwner.password;

//     if (!isMatch) {
//       return reply.status(400).send({ message: "Invalid Credentials" });
//     }

//     const shop = await Shop.findOne({ owner: shopOwner._id }).select(
//       "name location"
//     );

//     const { accessToken, refreshToken } = generateTokens(shopOwner);

//     return reply.send({
//       message: "Login Successful",
//       accessToken,
//       refreshToken,
//       owner: {
//         id: shopOwner._id,
//         name: shopOwner.name,
//         role: shopOwner.role,
//       },
//       shop: shop
//         ? {
//             id: shop._id,
//             name: shop.name,
//             location: shop.location,
//           }
//         : null,
//     });
//   } catch (error) {
//     return reply.status(500).send({ message: "An error occurred", error });
//   }
// };
// export const refreshToken = async (req, reply) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return reply.status(401).send({ message: "Refresh token required" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     let user;

//     if (decoded.role === "Customer") {
//       user = await Customer.findById(decoded.userId);
//     } else if (decoded.role === "DeliveryPartner") {
//       user = await DeliveryPartner.findById(decoded.userId);
//     } else if (decoded.role === "ShopOwner") {
//       user = await ShopOwner.findById(decoded.userId);
//     } else {
//       return reply.status(403).send({ message: "Invalid Role" });
//     }

//     if (!user) {
//       return reply.status(403).send({ message: "User not found" });
//     }

//     const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

//     return reply.send({
//       message: "Token Refreshed",
//       accessToken,
//       refreshToken: newRefreshToken,
//     });
//   } catch (error) {
//     return reply.status(403).send({ message: "Invalid Refresh Token" });
//   }
// };

// export const fetchUser = async (req, reply) => {
//   try {
//     const { userId, role } = req.user;
//     let user;

//     if (role === "Customer") {
//       user = await Customer.findById(userId);
//     } else if (role === "DeliveryPartner") {
//       user = await DeliveryPartner.findById(userId);
//     } else {
//       return reply.status(403).send({ message: "Invalid Role" });
//     }

//     if (!user) {
//       return reply.status(404).send({ message: "User not found" });
//     }

//     return reply.send({
//       message: "User fetched successfully",
//       user,
//     });
//   } catch (error) {
//     return reply.status(500).send({ message: "An error occurred", error });
//   }
// };


import { Customer, DeliveryPartner, ShopOwner } from "../../models/user.js";
import jwt from "jsonwebtoken";
import Shop from "../../models/shop.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

/* --------------------- CUSTOMER LOGIN (phone + password) -------------------- */

export const loginCustomer = async (req, reply) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return reply.status(400).send({
        message: "Phone and password are required",
      });
    }

    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return reply.status(404).send({
        message: "Customer not found",
      });
    }

    const isMatch = password === customer.password;

    if (!isMatch) {
      return reply.status(400).send({
        message: "Invalid Credentials",
      });
    }

    const { accessToken, refreshToken } = generateTokens(customer);

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.error("Customer login error", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

/* ------------------------- CUSTOMER SIGNUP (plain) -------------------------- */

export const registerCustomer = async (req, reply) => {
  try {
    const { name, phone, password, address, latitude, longitude } = req.body;

    if (!name || !phone || !password) {
      return reply
        .status(400)
        .send({ message: "Name, phone and password are required" });
    }

    if (password.length < 8) {
      return reply
        .status(400)
        .send({ message: "Password must be at least 8 characters long" });
    }

    const existing = await Customer.findOne({ phone });
    if (existing) {
      return reply.status(409).send({ message: "Phone already registered" });
    }

    // ⚠️ Plain-text password — no hashing
    const customer = new Customer({
      name,
      phone,
      password,
      address: address || "",
      liveLocation: {
        latitude: latitude || 0,
        longitude: longitude || 0,
      },
      role: "Customer",
      isActivated: true,
    });

    await customer.save();

    const { accessToken, refreshToken } = generateTokens(customer);

    return reply.send({
      message: "Signup Successful",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.error("Register customer error", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

/* -------------------- DELIVERY PARTNER LOGIN (email+pwd) -------------------- */

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery Partner not found" });
    }

    const isMatch = password === deliveryPartner.password;

    if (!isMatch) {
      return reply.status(400).send({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(deliveryPartner);

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    console.error("Delivery partner login error", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};


export const loginShopOwner = async (req, reply) => {
  try {
    const { email, password } = req.body;

    // 🔹 populate("shop") so we get the shop doc with address + liveLocation
    const shopOwner = await ShopOwner.findOne({ email }).populate("shop");

    if (!shopOwner) {
      return reply.status(404).send({ message: "Shop Owner not found" });
    }

    const isMatch = password === shopOwner.password;
    if (!isMatch) {
      return reply.status(400).send({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(shopOwner);

    // 👇 Clean owner payload
    const ownerPayload = {
      id: shopOwner._id,
      name: shopOwner.name,
      email: shopOwner.email,
      phone: shopOwner.phone,
      address: shopOwner.address || "",
      role: shopOwner.role,
    };

    // 👇 Build shop payload from populated `shopOwner.shop`
    let shopPayload = null;
    if (shopOwner.shop) {
      const { _id, name, address, liveLocation } = shopOwner.shop;

      shopPayload = {
        id: _id,
        name,
        address: address || "",
        latitude: liveLocation?.latitude ?? 0,
        longitude: liveLocation?.longitude ?? 0,
      };
    }

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      owner: ownerPayload,
      shop: shopPayload,
    });
  } catch (error) {
    console.error("Shop owner login error", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};


/* ----------------------------- REFRESH TOKEN ------------------------------- */

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else if (decoded.role === "ShopOwner") {
      user = await ShopOwner.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }

    if (!user) {
      return reply.status(403).send({ message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return reply.send({
      message: "Token Refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error", error);
    return reply.status(403).send({ message: "Invalid Refresh Token" });
  }
};

/* ------------------------------- FETCH USER -------------------------------- */

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else if (role === "ShopOwner") {
      // populate shop for refetch on frontend if needed
      user = await ShopOwner.findById(userId).populate("shop");
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Fetch user error", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
