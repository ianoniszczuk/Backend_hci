

const pool = require('../config/db')

const transferFunds = async (req,res) => {

    const {senderId, receiverId, amount,description} = req.body

    console.log(req.body);


    try {

        await pool.query('BEGIN');

        const sender = await pool.query('SELECT saldo FROM usuarios WHERE id = $1',[senderId]);
        if(sender.rows.length === 0){
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        if(sender.rows[0].saldo < amount){
            return res.status(400).json({error: 'Saldo insuficiente'}); 
        }

        await pool.query('UPDATE usuarios SET saldo = saldo - $1  WHERE id = $2',[amount,senderId]);

        await pool.query('UPDATE usuarios SET saldo = saldo + $1  WHERE id = $2',[amount,receiverId]);

        await pool.query(
            'INSERT INTO transacciones (usuario_id_emisor,usuario_id_receptor,monto,descripcion) VALUES ($1,$2,$3,$4)',
            [senderId,receiverId,amount,description]
        );

        await pool.query('COMMIT');

        return res.status(200).json({mesagge: 'Transferencia realizada con EXITO'})
    } catch(error) {
        await pool.query('ROLLBACK');
        console.error('Error al hacer la transferencia: ',error);
        return res.status(500).json({error : 'Error al realizar la transferencia'});
    }


};

module.exports = {transferFunds};