// *********************************************** USERS ENDPOINTS **********************************************************

/* ************************************************* USERS CRUD *************************************************************

1. CREATE --> POST http://localhost:3001/users/ (+ body)
2. READ --> GET http://localhost:3001/users/ (+ optional query parameters)
3. READ (single user) --> GET http://localhost:3001/users/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId

*/

import express from "express" // 3RD PARTY MODULE (needs to be installed with npm i express)
import fs from "fs" // CORE MODULE (no need to be installed)
import { fileURLToPath } from "url" // CORE MODULE (no need to be installed)
import { dirname, join } from "path" // CORE MODULE (no need to be installed)
import uniqid from "uniqid" // 3RD PARTY MODULE (needs to be installed with npm i uniqid)

const usersRouter = express.Router()

// **************** HOW TO GET USERS JSON PATH *************************

// target --> C:\Strive\FullStack\2022\Jan22\M5\strive-m5-d2-jan22\src\services\users\users.json

// 1. Get the current file path dynamically --> C:\Strive\FullStack\2022\Jan22\M5\strive-m5-d2-jan22\src\services\users\index.js
// console.log("IMPORT META URL: ", import.meta.url)
// console.log("CURRENT FILE PATH: ", fileURLToPath(import.meta.url))
const currentFilePath = fileURLToPath(import.meta.url)

// 2. From current file path I can get the parent's folder path --> C:\Strive\FullStack\2022\Jan22\M5\strive-m5-d2-jan22\src\services\users\
const parentFolderPath = dirname(currentFilePath)
// console.log("PARENT FOLDER PATH: ", parentFolderPath)

// 3. Concatenate parent's folder path with "users.json" --> C:\Strive\FullStack\2022\Jan22\M5\strive-m5-d2-jan22\src\services\users\users.json

const usersJSONPath = join(parentFolderPath, "users.json") // Normally you would concatenate two strings with the "+" symbol, please don't do that when dealing with paths --> use JOIN instead
// console.log("USERS JSON PATH: ", usersJSONPath)

// ********************************************************************

// 1.
usersRouter.post("/", (req, res) => {
  // 1. Read the request body to obtain new user's data
  console.log("REQUEST BODY: ", req.body) // DO NOT FORGET to add server.use(express.json()) in server.js

  // 2. Add some server generated informations (unique id, creation date, ...)
  const newUser = { ...req.body, createdAt: new Date(), id: uniqid() }
  console.log(newUser)

  // 3. Read users.json file --> obtaining an array
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 4. Add new user to array (with push)
  usersArray.push(newUser)

  // 5. Write the array back to users.json file
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray)) // we cannot pass an array to this function, but we can pass the stringified version of it

  // 6. Send a proper response back

  res.status(201).send({ id: newUser.id })
})

// 2.
usersRouter.get("/", (req, res) => {
  // 1. Read the content of the users.json file
  const fileContent = fs.readFileSync(usersJSONPath) // You obtain a BUFFER object, which is MACHINE READABLE ONLY (it could be "translated" tho)

  // 2. Obtain an array from the file
  const usersArray = JSON.parse(fileContent)

  // 3. Send back the array as a response
  res.send(usersArray)
})

// 3.
usersRouter.get("/:userId", (req, res) => {
  // 0. Extract the userId from the url
  const userId = req.params.userId
  console.log("REQ.PARAMS.USERID: ", req.params.userId)
  // 1. Read file --> obtaining users as array
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Find the specific user by id in the array
  const foundUser = usersArray.find(user => user.id === userId)

  // 3. Send it over as a response
  res.send(foundUser)
})

// 4.
usersRouter.put("/:userId", (req, res) => {
  // 1. Read file --> obtaining an array of users
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Modify the specified user into the array by merging previous properties and new properties from req.body
  const index = usersArray.findIndex(user => user.id === req.params.userId)
  const oldUser = usersArray[index]
  const updatedUser = { ...oldUser, ...req.body, updatedAt: new Date() }

  usersArray[index] = updatedUser

  // 3. Save the modified array back to users.json file
  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray))

  // 4. Send back a proper response
  res.send(updatedUser)
})

// 5.
usersRouter.delete("/:userId", (req, res) => {
  // 1. Read file --> obtaining an array of users
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Filter out the specified user from the array, obtaining an array of just the remaining users
  const remainingUsers = usersArray.filter(user => user.id !== req.params.userId)

  // 3. Save the remaining users back on users.json file
  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers))

  // 4. Send back a proper response
  res.status(204).send()
})

export default usersRouter // DO NOT FORGET TO EXPORT THE ROUTER
