const mongoose = require('mongoose')

const connectUrl = process.env.MONGODB_URI
mongoose.connect(connectUrl)
    .then(() => {
        console.log('successfully connected')
    })
    .catch(error => {
        console.log(`Failed to connect to mongdob, URI: ${connectUrl}, ERROR: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', personSchema)