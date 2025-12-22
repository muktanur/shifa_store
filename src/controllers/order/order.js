import Order from "../../models/order.js";
import Branch from "../../models/branch.js";
import Shop from "../../models/shop.js";
import { Customer, DeliveryPartner, ShopOwner } from "../../models/user.js";
import Product from "../../models/products.js";

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return reply.status(400).send({ message: "Items required" });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    // 🔥 derive shop from FIRST PRODUCT
    const firstItem = items[0];

    const product = await Product.findById(firstItem.item).populate("shop");

    if (!product || !product.shop) {
      return reply.status(400).send({
        message: "Invalid shop (product not linked to shop)",
      });
    }

    const shop = product.shop;

    const order = new Order({
      customer: userId,
      shop: shop._id,
      branch: shop.branch || null,
      items: items.map((i) => ({
        item: i.item,
        count: i.count,
      })),
      totalPrice,
      status: "PLACED",
      pickupLocation: {
        latitude: shop.liveLocation?.latitude || 0,
        longitude: shop.liveLocation?.longitude || 0,
        address: shop.address || "Shop address not set",
      },
      deliveryLocation: {
        latitude: customer.liveLocation?.latitude || 0,
        longitude: customer.liveLocation?.longitude || 0,
        address: customer.address || "Customer address not set",
      },
    });

    let savedOrder = await order.save();
    savedOrder = await savedOrder.populate("items.item");

    return reply.status(201).send(savedOrder);
  } catch (error) {
    console.error("Create order error:", error);
    return reply.status(500).send({ message: "Failed to create order" });
  }
};

// export const createOrder = async (req, reply) => {
//   try {
//     const { userId } = req.user;
//     const { items, totalPrice } = req.body;

//     if (!items || items.length === 0) {
//       return reply.status(400).send({ message: "Items required" });
//     }

//     const customer = await Customer.findById(userId);
//     if (!customer) {
//       return reply.status(404).send({ message: "Customer not found" });
//     }

//     console.log("ITEMS 👉", items);

//     const productId = items[0]?.item;
//     if (!productId) {
//       return reply.status(400).send({ message: "Invalid product data" });
//     }

//     const product = await Product.findById(productId).populate("shop");

//     console.log("PRODUCT 👉", product);

//     if (!product) {
//       return reply.status(400).send({ message: "Product not found" });
//     }

//     if (!product.shop) {
//       return reply.status(400).send({ message: "Product has no shop" });
//     }

//     const shop = product.shop;

//     const order = new Order({
//       customer: userId,
//       shop: shop._id,
//       items: items.map((i) => ({
//         item: i.item,
//         count: i.count,
//       })),
//       totalPrice,
//       status: "PLACED",
//       pickupLocation: {
//         latitude: shop.liveLocation?.latitude || 0,
//         longitude: shop.liveLocation?.longitude || 0,
//         address: shop.address || "",
//       },
//       deliveryLocation: {
//         latitude: customer.liveLocation?.latitude || 0,
//         longitude: customer.liveLocation?.longitude || 0,
//         address: customer.address || "",
//       },
//     });

//     const savedOrder = await order.save();
//     await savedOrder.populate("items.item");

//     return reply.status(201).send(savedOrder);
//   } catch (error) {
//     console.error("Create order error:", error);
//     return reply.status(500).send({ message: "Failed to create order" });
//   }
// };

// export const createOrder = async (req, reply) => {
//   try {
//     const { userId } = req.user;
//     const { items, totalPrice } = req.body;

//     if (!items || items.length === 0) {
//       return reply.status(400).send({ message: "Items required" });
//     }

//     const customer = await Customer.findById(userId);
//     if (!customer) {
//       return reply.status(404).send({ message: "Customer not found" });
//     }

//     // 🔥 DERIVE SHOP FROM PRODUCT
//     const firstItem = items[0];
//     const product = await Product.findById(firstItem.item).populate("shop");

//     if (!product || !product.shop) {
//       return reply.status(400).send({ message: "Invalid shop" });
//     }

//     const shop = product.shop;

//     const order = new Order({
//       customer: userId,
//       shop: shop._id,
//       branch: shop.branch,
//       items: items.map(i => ({
//         item: i.item,
//         count: i.count,
//       })),
//       totalPrice,
//       status: "PLACED",
//       pickupLocation: {
//         latitude: shop.liveLocation.latitude,
//         longitude: shop.liveLocation.longitude,
//         address: shop.address,
//       },
//       deliveryLocation: {
//         latitude: customer.liveLocation.latitude,
//         longitude: customer.liveLocation.longitude,
//         address: customer.address,
//       },
//     });

//     const savedOrder = await order.save();
//     await savedOrder.populate("items.item");

//     return reply.status(201).send(savedOrder);
//   } catch (error) {
//     console.error("Create order error:", error);
//     return reply.status(500).send({ message: "Failed to create order" });
//   }
// };

// export const createOrder = async (req, reply) => {
//   try {
//     const { userId } = req.user;
//     const { items, totalPrice } = req.body;

//     const customerData = await Customer.findById(userId);
//     if (!customerData) {
//       return reply.status(404).send({ message: "Customer not found" });
//     }

//     // 🔑 derive shop from item
//     const shopId = items[0].shop;
//     const shop = await Shop.findById(shopId).populate("branch");

//     if (!shop) {
//       return reply.status(400).send({ message: "Invalid shop" });
//     }

//     const newOrder = new Order({
//       customer: userId,
//       shop: shop._id, // ✅ VERY IMPORTANT
//       branch: shop.branch._id, // ✅ derived, not from frontend
//       items: items.map((item) => ({
//         id: item.id,
//         item: item.item,
//         count: item.count,
//       })),
//       totalPrice,
//       status: "PLACED", // ✅ standardized
//       pickupLocation: {
//         latitude: shop.liveLocation.latitude,
//         longitude: shop.liveLocation.longitude,
//         address: shop.address || "No address available",
//       },
//       deliveryLocation: {
//         latitude: customerData.liveLocation.latitude,
//         longitude: customerData.liveLocation.longitude,
//         address: customerData.address || "No address available",
//       },
//     });

//     let savedOrder = await newOrder.save();
//     savedOrder = await savedOrder.populate("items.item");

//     return reply.status(201).send(savedOrder);
//   } catch (error) {
//     console.log(error);
//     return reply.status(500).send({ message: "Failed to create order" });
//   }
// };

export const acceptOrderByShopOwner = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId, role } = req.user;

    if (role !== "ShopOwner") {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    const shopOwner = await ShopOwner.findById(userId);
    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    // 🔐 security check
    if (order.shop.toString() !== shopOwner.shop.toString()) {
      return reply.status(403).send({ message: "Not your shop order" });
    }

    if (order.status !== "PLACED") {
      return reply.status(400).send({ message: "Invalid order state" });
    }

    order.status = "AVAILABLE_FOR_DELIVERY";
    await order.save();

    // 🔔 notify delivery partners
    req.server.io.emit("orderAvailable", order);

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: "Failed to accept order" });
  }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return reply.status(404).send({ message: "Delivery Person not found" });
    }
    const order = await Order.findById(orderId);
    if (!order) return reply.status(404).send({ message: "Order not found" });

    if (order.status !== "available") {
      return reply.status(400).send({ message: "Order is not available" });
    }

    order.status = "confirmed";

    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation?.latitude,
      longitude: deliveryPersonLocation?.longitude,
      address: deliveryPersonLocation?.address || "",
    };

    req.server.io.to(orderId).emit("orderConfirmed", order);
    await order.save();

    return reply.send(order);
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send({ message: "Failed to confirm order", error });
  }
};

export const assignOrderToDeliveryPartner = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId, role } = req.user;

    if (role !== "DeliveryPartner") {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    if (order.status !== "AVAILABLE_FOR_DELIVERY") {
      return reply.status(400).send({ message: "Order not available" });
    }

    order.status = "ASSIGNED_TO_DELIVERY";
    order.deliveryPartner = userId;
    await order.save();

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: "Failed to assign order" });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPersonLocation } = req.body;
    const { userId } = req.user;

    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    if (order.deliveryPartner.toString() !== userId) {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();

    // 🔴 live tracking
    req.server.io.to(orderId).emit("liveTrackingUpdates", order);

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: "Failed to update order" });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
      query.branch = branchId;
    }

    const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    );

    return reply.send(orders);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Failed to retrieve orders", error });
  }
};

export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    return reply.send(order);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Failed to retrieve order", error });
  }
};
