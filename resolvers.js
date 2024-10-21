import { Todo } from "./models/todo.js";
import { User } from "./models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const resolvers = {
  Query: {
    todos: async (parent, args) => {
      return await Todo.find();
    },
    todo: async (parent, args) => {
      return await Todo.findById(args.id);
    },
    users: async (parent, args) => {
      return await User.find();
    },
    user: async (parent, args) => {
      return await User.findById(args.id);
    },
  },
  Mutation: {
    registerUser: async (parent, args) => {
      const user = await User.create(args.user);
      return user;
    },
    login: async (parent, { loginInput }) => {
      if (!loginInput.email || !loginInput.password) {
        return { success: false, message: "Please provide email and password" };
      }
      const user = await User.findOne({ email: loginInput.email });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const isMatch = await bcrypt.compare(loginInput.password, user.password);
      if (!isMatch) {
        return "Password or email is incorrect";
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return { success: true, token: token, message: "Login successful" };
    },
    deleteUser: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to delete a user");
      }
      if (context.user.role !== "admin") {
        throw new Error("You must be an admin to delete a user");
      }
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    // TODO MUTATIONS 
    createTodo: async (parent, { todo }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to create a todo");
      }
      if (context.user.role !== "admin") {
        throw new Error("You must be an admin to create a todo");
      }
      const newTodo = await Todo.create({
        ...todo,
        userId: context.user._id,
      });
      return newTodo;
    },
    updateTodo: async (parent, { id, title, description, completed }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to update a todo");
      }
      if (context.user.role !== "admin") {
        throw new Error("You must be an admin to update a todo");
      }
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, description, completed },
        { new: true }
      );
      if (!updatedTodo) {
        throw new Error("Todo not found");
      }
      return updatedTodo;
    },
    deleteTodo: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to delete a todo");
      }
      if (context.user.role !== "admin") {
        throw new Error("You must be an admin to delete a todo");
      }
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) {
        throw new Error("Todo not found");
      }
      return true;
    },
    
  },
};
