const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

/* Tätä medotia käytetään, kun luodaan uutta käyttäjää varten id */
const generateId = () => {
    const id = Math.ceil(Math.random() * 100)
    return id
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/info', (request, response) => {
    response.json('Phonebook has info for ' + persons.length + ' people '
        + new Date())
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    /*
        if (!body.name) {
            return response.status(400).json({
                error: 'name missing'
            })
        } else if (!body.number) {
            return response.status(400).json({
                error: 'number missing'
            })
        } else if (persons.find(person => person.name === body.name)) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        } else {
    
            const person = {
                name: body.name,
                number: body.number,
                id: generateId(),
            }
    
    
    
            persons = persons.concat(person)
    
            response.json(body)
        }
    */



    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })



})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




