import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
  }),
  description: Joi.string().min(5).max(500).required(),
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  baseMetal: Joi.string().valid("Gold", "Silver", "Platinum", "Diamond", "Copper").required(),
  polish: Joi.string().valid("Matte", "Glossy", "Textured", "Antique").required(),
  rating: Joi.number().min(0).max(5).default(0),
  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Image URL must be a valid link",
  }),
});
