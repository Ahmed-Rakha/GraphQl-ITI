export const schema = `#graphql

type Query {
    users: [User]
    todos: [Todo]
    user(id: ID!): User
    todo(id: ID!): Todo
}

type Mutation {
    registerUser(user: newUser): User
    login(loginInput: loginInput): loginResponse
    createTodo(todo: newTodo): Todo
    updateTodo(id: ID!, title: String, description: String, completed: Boolean): Todo
    deleteTodo(id: ID!): Boolean
    deleteUser(id: ID!): Boolean
}

input newUser {
    name: String!
    email: String!
    password: String!
    role: String
}
input loginInput {
    email: String!
    password: String!
}
type User {
    _id: ID!
    name: String!
    email: String!
     password: String!
     role: String!
}

input newTodo {
    title: String!
    description: String!
    completed: Boolean
    user: ID
}
type Todo {
    _id: ID!
    title: String!
    description: String!
    completed: Boolean!
    user: User
}

type loginResponse {
    success: Boolean
    token: String
    message: String
}
`;
