

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

const getLastTransactions = async (req, res) => {
    const { userId } = req.params;  // Obtener userId desde los parámetros de la URL

    try {
        // Consulta para obtener las últimas transacciones (enviadas y recibidas)
        const result = await pool.query(
            `SELECT 
                t.id,
                t.monto,
                t.descripcion,
                t.fecha,
                t.usuario_id_emisor,
                t.usuario_id_receptor,
                ue.nombre as nombre_emisor,
                ur.nombre as nombre_receptor
            FROM transacciones t
            JOIN usuarios ue ON t.usuario_id_emisor = ue.id
            JOIN usuarios ur ON t.usuario_id_receptor = ur.id
            WHERE t.usuario_id_emisor = $1 OR t.usuario_id_receptor = $1
            ORDER BY t.fecha DESC
            LIMIT 10`,
            [userId]
        );

        if(result.rows.length == 0){
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        // Formatear las transacciones para la respuesta
        const transactions = result.rows.map(t => ({
            id: t.id,
            amount: t.monto,
            description: t.descripcion,
            date: t.fecha,
            type: t.usuario_id_emisor === parseInt(userId) ? 'sent' : 'received',
            otherUser: t.usuario_id_emisor === parseInt(userId) 
                ? { id: t.usuario_id_receptor, name: t.nombre_receptor }
                : { id: t.usuario_id_emisor, name: t.nombre_emisor }
        }));

        return res.status(200).json(
            transactions
        );

    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        return res.status(500).json({ error: 'Error al obtener las transacciones' });
    }
};

module.exports = {transferFunds,getLastTransactions};