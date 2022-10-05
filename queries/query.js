const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql")
let { Books, Authors } = require("../mockData")

const BookType = new GraphQLObjectType({
  name: "Books",
  description: "This is books model",
  fields: () => ({
    isbn: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    subtitle: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    published: { type: GraphQLNonNull(GraphQLString) },
    publisher: { type: GraphQLNonNull(GraphQLString) },
    pages: { type: GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLNonNull(GraphQLString) },
    website: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return Authors.find((auth) => auth.authorId === book.authorId)
      },
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: "Authors",
  description: "List of all authors",
  fields: () => ({
    author: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    bookId: { type: new GraphQLNonNull(GraphQLString) },
    book: {
      type: BookType,
      resolve: (author) => {
        return Books.find((book) => book.isbn == author.bookId)
      },
    },
  }),
})

const RootQueryBooksType = new GraphQLObjectType({
  name: "Query",
  description: "Books Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => {
        return Books
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => Authors,
    },
    book: {
      type: BookType,
      description: "Returns single book from the collection of all books",
      args: {
        id: { type: GraphQLString },
      },
      resolve: (parent, args) => Books.find((book) => book.isbn === args.id),
    },
    author: {
      type: AuthorType,
      description: "Return single author from the authors",
      args: {
        authorId: { type: GraphQLInt },
      },
      resolve: (_, args) =>
        Authors.find((author) => author.authorId === args.authorId),
    },
  }),
})

module.exports = { RootQueryBooksType, BookType, AuthorType }
