const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const userScheme = new mongoose.Schema({
    username: String,
    password: String,
    points: Int,
    ow: Int
})

userScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

User = mongoose.model('User', userScheme)

const likeScheme = new mongoose.Schema({
    post_id: Int,
    receiver: String,
    sender: String,
    vote: Int
})

likeScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
Like = mongoose.model('Like', likeScheme)



const postScheme = new mongoose.Schema({
    id: Int,
    username: String,
    post: String
})

likeScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
Like = mongoose.model('Like', likeScheme)