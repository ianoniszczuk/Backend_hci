const express = require('express');
const { addCard, getUserCard , deleteCard } = require('../controllers/userController');
const router = express.Router();

router.post('/user/addCard', addCard);

router.get('/user/getCards/:userId',getUserCard);

router.delete('/user/deleteCard/:cardNumber', deleteCard);

module.exports = router;