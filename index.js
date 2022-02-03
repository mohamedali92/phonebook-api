const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const {request, response} = require("express");
const app = express()
app.use(cors())

morgan.token('postBody', function (req, res) { return JSON.stringify(req.body) })
const morganConfigTiny = morgan('tiny')

const morganConfigComplex = morgan(':method :url :status :res[content-length] - :response-time ms :postBody')
app.use(express.json())
app.use(morganConfigComplex)

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numEntriesInPhonebook = persons.length
    const currentDateTime = new Date()
    console.log(currentDateTime)
    response.status(200).send(`Phonebook has ${numEntriesInPhonebook} entries <br> ${currentDateTime}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send(`Couldn't find a user with this id ${id}`)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => {
        return person.id !== id
    })
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body
    if ( (!body.name) || (!body.number)) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    if(persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: `The supplied name ${body.name} already exists`
        })
    }

    const maxId = Math.max(...persons.map(p => p.id))
    const newPerson = {...request.body, id: maxId + 1}
    // console.log(newPerson)
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})
