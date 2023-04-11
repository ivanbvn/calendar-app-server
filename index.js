const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/config')
require('dotenv').config()

// Levantar el servidor.
const app = express()

// Base de datos.
dbConnection()

// CORS.
app.use(cors())

// Directorio público.
app.use(express.static('public'))

// Lectura y parseo del body.
app.use(express.json())

//Rutas.
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// Escuchar las peticiones.
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})