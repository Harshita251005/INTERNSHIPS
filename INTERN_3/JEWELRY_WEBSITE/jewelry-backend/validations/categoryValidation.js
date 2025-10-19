import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Category name is required",
  }),
  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Image URL must be valid",
  }),
});
