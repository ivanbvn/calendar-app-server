const {response} = require('express')
const jwt = require('jsonwebtoken')

const validarJWT = (req, res = response, next) => {
    // Recibir el JWT.
    // x-token headers.
    const token = req.header('x-token')
        
    // Validar el JWT.
    if(!token) {
        return res.status(401).json({
            ok: false, 
            msg: 'No hay token en la petición'
        })
    }
    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        )
        const {uid, name} = payload
        req.uid = uid
        req.name = name
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

    next()
}   

module.exports = {
    validarJWT
}