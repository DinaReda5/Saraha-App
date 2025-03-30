import { asyncHandler } from "../utilits/error/index.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let validationResult = [];
    for (const key of Object.keys(schema)) {
      const validationError = schema[key].validate(req[key], 
        { abortEarly: false });
      if (validationError?.error) {
        validationResult.push(validationError.error.details);
      }
    }
    if (validationResult.length > 0) {
      // return next(new Error(validationResult , { cause: 409 }))
      return res.status(409).json({ message: "validation error", errors:validationResult });
    }

    next();
  }
};
