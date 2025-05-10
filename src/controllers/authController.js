//TODO : AGREGAR DEVOLUCION DE JWT

const validator = require('validator');

const pool = require('../config/db/index.js');


const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    if(name.length < 3) {
        return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres' });
    }
    if(!validator.isEmail(email)) {
        return res.status(400).json({ error: 'El email no es válido' });
    }
    if(password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }


    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre,  email, contraseña ) VALUES ($1, $2,$3) RETURNING id,nombre,email,saldo',
            [name,  email, password]
        );

        const userId = result.rows[0].id

        const cbu = String(userId).padStart(22, '0');

        await pool.query(
            'UPDATE usuarios SET cbu = $1 WHERE id = $2',
            [cbu, userId]
          );

        const updateUser = await pool.query(
            'SELECT id,cbu,nombre,email,saldo FROM usuarios WHERE id = $1',[userId]
        );

        const userData = updateUser.rows[0];

        console.log('Usuario registrado:', userData);

        return res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            user: {
                id : userData.id,
                nombre: userData.nombre,
                email: userData.email,
                saldo : userData.saldo
            }
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        if (error.code === '23505') {  // Código para violación de restricción única
            // Verificar qué campo específico causó el error
            if (error.constraint.includes('email')) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            } else if (error.constraint.includes('nombre')) {
                return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
            }
            return res.status(400).json({ error: 'Ya existe un registro con esos datos' });
        } else if (error.code === '23503') {  // Violación de clave foránea
            return res.status(400).json({ error: 'Error de referencia en la base de datos' });
        } else if (error.code === '23502') {  // Violación de no nulidad
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
    }
}

const loginUser = async (req, res) => {

    console.log('Login request body:', req.body); // Log the request body

    const {email, password} = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND contraseña = $2',
            [email, password]
        );
        if (result.rows.length > 0) {

            const userData = result.rows[0];

            console.log('Usuario encontrado:', userData); // Log the found user

            return res.status(200).json({
                message: 'Login exitoso' ,

                user: {
                    id: userData.id,
                    nombre: userData.nombre,
                    email: userData.email,
                    saldo : userData.saldo,
                    cbu : userData.cbu
                }
            
            });

        } else {
            console.log('Credenciales incorrectas'); // Log incorrect credentials
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }

}

module.exports = {
    registerUser,
    loginUser
}
