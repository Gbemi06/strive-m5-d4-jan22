import fs from "fs-extra"
import { fileURLToPath } from "url"
import { join, dirname } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const booksJSONPath = join(dataFolderPath, "books.json")
const usersJSONPath = join(dataFolderPath, "users.json")

// const getJSONPath = filename => join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename)

const usersPublicFolderPath = join(process.cwd(), "./public/img/users")

export const getBooks = () => readJSON(booksJSONPath)
export const writeBooks = content => writeJSON(booksJSONPath, content)
export const getUsers = () => readJSON(usersJSONPath)
export const writeUsers = content => writeJSON(usersJSONPath, content)

export const saveUsersAvatars = (filename, contentAsBuffer) => writeFile(join(usersPublicFolderPath, filename), contentAsBuffer)
