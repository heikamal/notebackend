require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
      })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0 
        ? Math.max(...notes.map(n => n.id)) 
        : 0

    return maxId + 1
}

app.post('/api/notes', (req, res) => {
    
    const body = req.body
    if (body.content === undefined) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: 'uknown endpoint' })
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})