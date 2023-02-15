const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    date: {type : Date , required: true},
    description: {type : String , required: true},
    category: String,
    amount: {type :Number, min : 1},
    note: String
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)
//Make this exportable to be accessed in server.js
module.exports = Transaction