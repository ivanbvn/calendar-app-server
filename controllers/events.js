const { response } = require('express')
const Event = require('../models/event-model')

const getEventos = async (req, res = response) => {
    const events = await Event.find()
        .populate('user', 'name')
    res.json({
        ok: true,
        events
    })
}
const crearEvento = async (req, res = response) => {
    const event = new Event(req.body)
    try {
        event.user = req.uid
        const saveEvent = await event.save()
        res.json({
            ok: true,
            event: saveEvent,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}
const actualizarEvento = async(req, res = response) => {
    const eventId = req.params.id
    const uid = req.uid
    try {
        const event = await Event.findById(eventId)
        if(!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        if(event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoActualizado = await Event.findByIdAndUpdate(eventId, nuevoEvento, {new: true})
        res.json({
            ok: true,
            event: eventoActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const deleteEvento = async(req, res = response) => {
    const eventId = req.params.id
    const uid = req.uid
    try {
        const event = await Event.findById(eventId)
        if(!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por id'
            })
        }
        if(event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }
        await Event.findByIdAndDelete(eventId)
        res.json({
            ok: true,
            msg: 'Evento eliminado'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    deleteEvento
}