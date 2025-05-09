const pool = require('../config/db')

const addCard = async (req,res) =>{

    const {clientId, cardNumber, holderName,  expiryDate, holderDocument} = req.body; 

    try {

        if (!clientId || !cardNumber || !holderName || !expiryDate) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        if (cardNumber.length < 13 || cardNumber.length > 16) {
            return res.status(400).json({ error: 'Número de tarjeta inválido' });
        }

        let cardType = 'Desconocida';
        if (/^4/.test(cardNumber)) cardType = 'Visa';
        else if (/^5[1-5]/.test(cardNumber)) cardType = 'Mastercard';
        else if (/^3[47]/.test(cardNumber)) cardType = 'American Express';
        else if (/^6(?:011|5)/.test(cardNumber)) cardType = 'Discover';

        const result = await pool.query(
            'INSERT INTO tarjeta (usuario_id, numero, nombre_titular, fecha_vencimiento, tipo_tarjeta, documento_titular) VALUES ($1, $2, $3, $4, $5, $6) RETURNING numero',
            [clientId, cardNumber, holderName, expiryDate, cardType, holderDocument]
        );

        return res.status(201).json({
            success: true,
            message: 'Tarjeta agregada correctamente',
            card: {
                cardNumber: cardNumber,
                holderName,
                expiryDate,
                cardType
            }
        });
    } catch (error) {
        console.error('Error al agregar tarjeta:', error);
        
        // Verificar si es un error de llave duplicada
        if (error.code === '23505') {
            return res.status(409).json({ 
                error: 'Esta tarjeta ya está registrada en el sistema' 
            });
        }
        
        return res.status(500).json({ 
            error: 'Error al registrar la tarjeta' 
        });
    
    }

}

const getUserCard = async (req,res) => {
    const userId = req.params.userId;


    try {
        const result = await pool.query(
            'SELECT numero, nombre_titular, fecha_vencimiento, tipo_tarjeta FROM tarjeta WHERE usuario_id = $1',
            [userId]
        );

        return res.status(200).json(
            result.rows
        );
    } 
    catch (error) {

        console.error('Error al obtener las tarjetas', error);
        return res.status(500).json({error : 'Error al obtener las tarjetas'});

    }

}

const deleteCard = async (req,res) => {

    const {cardNumber} = req.params;

    try {

        const result =  await pool.query(
            'DELETE FROM tarjeta WHERE numero = $1 RETURNING numero',[cardNumber]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarjeta no encontrada' });
        }

        return res.status(200).json({
            success: true,
            message: 'Tarjeta eliminada correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar tarjeta:', error);
        return res.status(500).json({ error: 'Error al eliminar la tarjeta' });
    }

}

module.exports = {addCard, getUserCard,deleteCard};