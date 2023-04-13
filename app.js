const express = require('express');
const cors = require('cors');
const continents = require('./continents.json');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Continents API');
    res.send('Learn more about Continents');
})

app.get('/continents', (req, res) => {
    res.send(continents);
})

app.get('/continents/:name', (req, res) => {
    const name = req.params.name;
    const continent = continents.find(continent => continent.name.toLowerCase() === name);
    console.log(continent);

    if (continent === undefined) {
        res.status(404).send({ error: `continent: ${name} not found` })
    }
    res.send(continent);
})

app.post('/continents/', (req, res) => {
    const name = req.body.name

    const ids = continents.map(continent => continent.id)
    const maxId = Math.max(...ids)

    const continent = continents.find(continent => continent.name === name)

    if (continent) {
        res.status(409).send({ error: `continent ${continent.name} already exists` })
    } else {
        maxId += 1;
        const newContinent = {
            name: name,
            id: maxId + 1
        }

        continents.push(newContinent)

        res.status(201).send(newContinent)
    }
})

app.patch('/continents/:name', (req, res) => {
    const name = req.params.name.toLowerCase()

    const continent = continents.find(continent => continent.name.toLowerCase() === name)

    if (!continent) {
        return res.status(404).send({ error: `continent ${name} does not exist in the database` })
    }
    try {
        const idx = continents.findIndex(p => p.id === continent.id)

        const updatedContinent = {
            ...req.body,
            name: req.body.name,
            id: continent.id
        }
        continents[idx] = updatedContinent
        console.log(continent[3])
        console.log(continents)
        res.send(updatedContinent)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.delete('/continents/:name', (req, res) => {
    const name = req.params.name.toLowerCase()

    const continentIndex = continents.findIndex(continent => continent.name.toLowerCase() === name)

    if (!continentIndex) {
        res.status(404).send({ error: `continent ${name} does not exist` })
    } else {
        continents.splice(continentIndex, -1)

        res.status(204).send()
    }
})

module.exports = app
