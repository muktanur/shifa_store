import "dotenv/config.js";
import mongoose from "mongoose";
import { Category, Product } from "./src/models/index.js";
import { categories, products } from "./seedData.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, Category) => {
      map[Category.name] = Category._id;
      return map;
    }, {});

    const productWithCategoryIds = products.map((Product) => ({
      ...Product,
      category: categoryMap[Product.category],
    }));

    await Product.insertMany(productWithCategoryIds);

    console.log("DATABSE SEEDED SUCCESSFULLY");
  } catch (error) {
    console.error("Error Seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
