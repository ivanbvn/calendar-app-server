const { response } = require('express')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const {generarJWT} = require('../helpers/jwt')

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body

    try {
        let user = await User.findOne({email})
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya está en uso'
            })
        }
        user = new User(req.body)

        // Encriptar contraseña.
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(password, salt)

        //Generar JWT
        const token = await generarJWT(user.id, user.name)

        await user.save()
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }

}
const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            })
        }
        
        // Confirmar los passwords.
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar nuestro JWT
        const token = await generarJWT(user.id, user.name)

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }

}
const revalidarToken = async(req, res = response) => {
    const {uid, name} = req

    // Generar un nuevo JWT y retornarlo en esta petición.
    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        uid, name, token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}