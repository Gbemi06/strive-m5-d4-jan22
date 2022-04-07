// *********************************************** BOOKS ENDPOINTS **********************************************************

/* ************************************************* BOOKS CRUD *************************************************************

1. CREATE --> POST http://localhost:3001/books/ (+ body)
2. READ --> GET http://localhost:3001/books/ (+ optional query parameters)
3. READ (single user) --> GET http://localhost:3001/books/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/books/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/books/:userId

*/

import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createError from "http-errors"

import { checkBookSchema, checkValidationResult } from "./validation.js"

const booksRouter = express.Router()

const anotherStupidMiddleware = (req, res, next) => {
  console.log("Hello I am a stupid middleware!")
  next()
}

const booksJsonPath = join(dirname(fileURLToPath(import.meta.url)), "books.json")

const getBooks = () => JSON.parse(fs.readFileSync(booksJsonPath))
const writeBooks = content => fs.writeFileSync(booksJsonPath, JSON.stringify(content))

// 1.
booksRouter.post("/", checkBookSchema, checkValidationResult, (req, res, next) => {
  try {
    const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }

    const books = getBooks()

    books.push(newBook)

    writeBooks(books)

    res.status(201).send({ id: newBook.id })
  } catch (error) {
    next(error) // when you use a next with an error as parameter the code will jump straight to the error handlers
  }
})

// 2.
booksRouter.get("/", anotherStupidMiddleware, (req, res, next) => {
  try {
    const books = getBooks()
    if (req.query && req.query.category) {
      const filteredBooks = books.filter(book => book.category === req.query.category)
      res.send(filteredBooks)
    } else {
      res.send(books)
    }
  } catch (error) {
    next(error)
  }
})

// 3.
booksRouter.get("/:bookId", (req, res, next) => {
  try {
    const books = getBooks()

    const foundBook = books.find(book => book.id === req.params.bookId)
    if (foundBook) {
      res.send(foundBook)
    } else {
      next(createError(404, `Book with id ${req.params.bookId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// 4.
booksRouter.put("/:bookId", (req, res, next) => {
  try {
    const books = getBooks()

    const index = books.findIndex(book => book.id === req.params.bookId)

    if (index !== -1) {
      const oldBook = books[index]

      const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() } // oldbook {title: "IT", category: "horror"} | req.body: {category: "fantasy"}

      books[index] = updatedBook

      writeBooks(books)

      res.send(updatedBook)
    } else {
      next(createError(404, `Book with id ${req.params.bookId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// 5.
booksRouter.delete("/:bookId", (req, res, next) => {
  try {
    const books = getBooks()

    const remainingBooks = books.filter(book => book.id !== req.params.bookId)

    writeBooks(remainingBooks)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default booksRouter // DO NOT FORGET TO EXPORT THE ROUTER
