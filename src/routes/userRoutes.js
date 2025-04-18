const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, deleteUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update', updateUser);
router.delete('/delete', deleteUser);

module.exports = router;
