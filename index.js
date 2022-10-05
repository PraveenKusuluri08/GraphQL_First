const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql")
const { RootMutation } = require("./mutations/mutation")
const { RootQueryBooksType } = require("./queries/query")
const app = express()

const schema = new GraphQLSchema({
  query: RootQueryBooksType,
  mutation: RootMutation,
})
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`App is listining to the port ${PORT}`)
})
