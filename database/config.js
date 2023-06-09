const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Online')
    } catch (error) {
        console.log(error)
        throw new Error('Error a la hora de inicializar DB')
    }
}

module.exports = {
    dbConnection
}