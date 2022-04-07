import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"

const bookSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title validation failed! Title is mandatory and must be a string",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category validation failed! Category is mandatory and must be a string",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "email not in the right format!",
    },
  },
}

export const checkBookSchema = checkSchema(bookSchema)

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // we had validation errors
    next(createError(400, "Validation problems in req.body", { errorsList: errors.array() }))
  } else {
    // everything fine
    next()
  }
}
