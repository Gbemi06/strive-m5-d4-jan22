import express from "express"
import multer from "multer"

import { saveUsersAvatars } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/:userId/avatar", multer().single("avatar"), async (req, res, next) => {
  // "avatar" does need to match exactly to the property name appended to the FormData object in the frontend, otherwise Multer is not going to be able to find the file in the request body
  try {
    console.log("FILE: ", req.file)
    await saveUsersAvatars("whatever.gif", req.file.buffer)

    // update userId record with the url of the newly updated avatar
    // 1. get users
    // 2. filter users by id
    // 3. if you find the user you should update that user data by adding avatar = avatarUrl
    // 4. save file

    // const avatarUrl = "http://localhost:3001/img/users/" + req.file.originalname

    // console.log(avatarUrl)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/multipleUpload", multer().array("avatars"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)

    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))

    await Promise.all(arrayOfPromises)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default filesRouter
