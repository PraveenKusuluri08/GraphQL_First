const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require("graphql")
const { BookType, AuthorType } = require("../queries/query")
const crypto = require("crypto")
const { Books, Authors } = require("../mockData")
const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738))
const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation Object",
  fields: () => ({
    addNewBook: {
      type: BookType,
      description: "Add new book",
      args: {
        isbn: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        subtitle: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        published: { type: GraphQLNonNull(GraphQLString) },
        publisher: { type: GraphQLNonNull(GraphQLString) },
        pages: { type: GraphQLNonNull(GraphQLInt) },
        description: { type: GraphQLNonNull(GraphQLString) },
        website: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        const isbn = crypto.randomBytes(13).toString("hex")
        const book = {
          isbn: isbn,
          title: args.title,
          subtitle: args.subtitle,
          authorId: args.authorId,
          published: new Intl.DateTimeFormat("en-GB", {
            dateStyle: "full",
            timeStyle: "long",
            timeZone: "UTC",
          }).format(date),
          publisher: args.publisher,
          pages: args.pages,
          description: args.description,
          website: args.website,
        }
        Books.push(book)
        return book
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Author",
      args: {
        author: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const authorId = Authors.length + 1
        const author = {
          author: args.author,
          authorId: authorId,
        }
        Authors.push(author)
        return author
      },
    },
    updateBook: {
      type: BookType,
      description: "Updates single book",
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        subtitle: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        website: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        let bookFound = Books.find((book) => book.isbn === args.id)
        if (bookFound) {
          let updateObj = {
            title: args.title,
            description: args.description,
            subtitle: args.subtitle,
            website: args.website,
            ...Books,
          }
          let index = Books.indexOf(bookFound)
          Books.splice(index, 1, updateObj)
        }
        return Books
      },
    },
    updateAuthor: {
      type: AuthorType,
      description: "Update author",
      args: {
        author: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        bookId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        let author = Authors.find((author) => author.authorId === args.authorId)
        if (!author) {
          return
        }
        let updateAuthorRecord = {
          author: args.author,
          authorId: args.authorId,
          bookId: args.bookId,
        }
        let index = Authors.indexOf(author)
        Authors.splice(index, 1, updateAuthorRecord)
        return updateAuthorRecord
      },
    },
  }),
})
module.exports = { RootMutation }
