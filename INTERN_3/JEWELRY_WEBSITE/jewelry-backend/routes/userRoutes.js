const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
	register,
	login,
	getProfile,
	updateProfile,
	changePassword,
	requestPasswordReset,
	resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// multer setup for avatar uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', 'uploads', 'avatars'));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${Date.now()}${ext}`);
	}
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);

// Protected profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/profile/password', protect, changePassword);

// Password reset
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
