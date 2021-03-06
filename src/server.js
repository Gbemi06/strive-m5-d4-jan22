// const express = require("express") // OLD SYNTAX
import express from "express" // <-- NEW IMPORT SYNTAX (remember to add "type": "module" to package.json to use it!)
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import usersRouter from "./services/users/index.js"
import booksRouter from "./services/books/index.js"
import filesRouter from "./services/files/index.js"

import { genericErrorHandler, notFoundErrorHandler, badRequestErrorHandler, unauthorizedErrorHandler } from "./errorHandlers.js"

const server = express()

const port = 3001

const publicFolderPath = join(process.cwd(), "./public")

// ******************************** MIDDLEWARES *************************************************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`)
  next()
}

server.use(express.static(publicFolderPath))
server.use(cors())
server.use(loggerMiddleware) // Global Middleware
server.use(express.json()) // If you don't add this configuration to our server (BEFORE the endpoints), all requests' bodies will be UNDEFINED

// ********************************* ENDPOINTS *******************

server.use("/users", usersRouter)
server.use("/books", booksRouter)
server.use("/files", filesRouter)

// ******************************* ERROR MIDDLEWARES *************************

server.use(badRequestErrorHandler) // 400
server.use(unauthorizedErrorHandler) // 401
server.use(notFoundErrorHandler) // 404
server.use(genericErrorHandler) // 500

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}!`)
})
