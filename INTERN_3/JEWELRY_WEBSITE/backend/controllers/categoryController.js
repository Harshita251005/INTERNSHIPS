import Category from '../models/Category.js';

/**
 * Get all categories (Public)
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.',
      error: error.message,
    });
  }
};

/**
 * Create category (Admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, subcategories, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const category = new Category({
      name,
      description,
      subcategories: subcategories || [],
      image,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: {
        category,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create category.',
      error: error.message,
    });
  }
};

/**
 * Update category (Admin)
 */
export const updateCategory = async (req, res) => {
  try {
    const { name, description, subcategories, image } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (subcategories) category.subcategories = subcategories;
    if (image !== undefined) category.image = image;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category.',
      error: error.message,
    });
  }
};

/**
 * Delete category (Admin)
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category.',
      error: error.message,
    });
  }
};
