require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(cors())

morgan.token('postBody', function (req) { return JSON.stringify(req.body) })

const morganConfigComplex = morgan(':method :url :status :res[content-length] - :response-time ms :postBody')
app.use(express.json())
app.use(morganConfigComplex)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(result => {
            response.json(result)
        })
})

app.get('/info', (request, response) => {
    Person.count({})
        .then(numEntriesInPhonebook => {
            const currentDateTime = new Date()
            response.status(200).send(`Phonebook has ${numEntriesInPhonebook} entries <br> ${currentDateTime}`)
        })
        .catch(error => {
            response.status(500).send(`Couldn't get the number of persons, due to this error: ${error}`)
        })

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            console.log(person)
            if (person) {
                response.json(person)
            } else {
                response.status(404).send(`Couldn't find a person with this ${id}`)
            }


        })
        .catch(error => {
            console.log(error)
            next(error)
        })

})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if ( (!body.name) || (!body.number)) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    Person.find({ name: body.name })
        .then(foundPerson => {
            console.log(foundPerson)
            if (foundPerson.length > 0) {
                return response.status(400).json({
                    error: `The supplied name ${body.name} already exists`
                })
            } else {
                const newPerson = new Person({
                    name: request.body.name,
                    number: request.body.number
                })
                newPerson.save()
                    .then(result => {
                        console.log(result)
                        response.json(result)
                    })
                    .catch(error => {
                        next(error)
                    })
            }
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            response.json(updatedPerson)
        })
        .catch(error => {
            next(error)
        })

})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})
