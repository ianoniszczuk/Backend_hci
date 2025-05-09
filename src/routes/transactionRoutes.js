/*TODO : AGREGAR MIDDLEWARE DE TRANSFERENCIA PARA CHEQUEAR 
    QUE EL QUE EL ID DEL QUE MANDA EL DINERO SEA EL ID DE LA SESION ACTUAL
*/
const express = require('express');
const {transferFunds, getLastTransactions } = require('../controllers/transactionController');
const router = express.Router();

router.post('/transactions/transferFunds', transferFunds);
router.get('/transactions/getTransactions/:userId',getLastTransactions)

module.exports = router;
