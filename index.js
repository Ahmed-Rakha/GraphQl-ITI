import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { schema } from "./schema.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { User } from "./models/user.js";
import { resolvers } from "./resolvers.js";
// console.log(process.env.JWT_SECRET_KEY);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },

      context: async ({ req }) => {
        const { authorization } = req.headers;
        
        if (!authorization) {
          return { user: null };
        }
        try {
          const token = authorization;
          const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
          const user = await User.findById(decoded.userId);
         
          
          return {user};
        } catch (error) {
          console.log(error);
          return { user: null };
        }
      }
    });
    console.log(`🚀  Server ready at: ${url}`);
}
  catch (error) {
    console.log(error);
  }
}

start();

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
  

//   context: async ({ req }) => {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       return { user: null };
//     }
//     try {
//       const token = authorization.split(" ")[1];
//       const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
//       const user = await User.findById(decoded.userId);
//       return { user };
//     } catch (error) {
//       console.log(error);
//       return { user: null };
//     }
//   },
// });
