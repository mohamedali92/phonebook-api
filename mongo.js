const mongoose = require('mongoose')

const numCmdLineArgs = process.argv.length

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}


if (numCmdLineArgs < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const connectUrl = `mongodb+srv://fullstack:${password}@fso.ieusa.mongodb.net/Person?retryWrites=true&w=majority`
mongoose.connect(connectUrl)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})
const personModel = mongoose.model('Person', personSchema)

if (numCmdLineArgs === 3) {
    personModel.find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
}
else if (numCmdLineArgs === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    console.log(name, number)
    const newPerson = new personModel({
        id: getRandomInt(0, Number.MAX_SAFE_INTEGER),
        name: name,
        number: number
    })

    newPerson.save(result => {
        console.log(result)
        console.log('saving to db')
        mongoose.connection.close()
    })
}
else {
    console.log('Unidentified number of arguments')
}






