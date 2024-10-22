// MongoDB 연결 Setting Code
const {MongoClient} = require('mongodb');

let db
const url = process.env.DB_URL;
let connectDB = new MongoClient(url).connect()

module.exports = connectDB