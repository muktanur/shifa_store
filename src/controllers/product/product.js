import Product from "../../models/products.js";

export const getProductsByCategoryId = async (req, reply) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .populate({
        path: "shop",
        select: "name location owner",
        populate: {
          path: "owner",
          model: "ShopOwner",
          select: "name",
        },
      })
      .exec();

    return reply.send(products);
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
