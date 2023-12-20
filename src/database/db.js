import pakages from 'mongoose'
const { connect, connection } = pakages

connect('mongodb://localhost:27017/UserCollection', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = connection

db.on('error', console.error.bind(console, 'mongodb error'))
db.once('open', () => {
    console.log("connected to database")
})

export default db