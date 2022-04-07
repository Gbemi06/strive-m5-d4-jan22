import fs from "fs-extra"
import { fileURLToPath } from "url"
import { join, dirname } from "path"

const { readJSON, writeJSON } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const booksJSONPath = join(dataFolderPath, "books.json")
const usersJSONPath = join(dataFolderPath, "users.json")

console.log(booksJSONPath)

// const getJSONPath = filename => join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename)

export const getBooks = () => readJSON(booksJSONPath)
export const writeBooks = content => writeJSON(booksJSONPath, content)
export const getUsers = () => readJSON(usersJSONPath)
export const writeUsers = content => writeJSON(usersJSONPath, content)
