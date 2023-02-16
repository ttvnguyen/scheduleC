const express = require('express')
const Transaction = require('../models/transactions.js')
const router = express.Router()

//Test router calling route
// router.get('/', (req, res) =>{
//     res.send('This is the transactions controller')
// })

//Transaction index route
router.get('/', (req, res) => {
    // res.render('index.ejs')
    Transaction.find((err, transactions) => {
      if(err){
        console.log(err, ': ERROR IN INDEX ROUTE QUERY')
      } else {
        // console.log(transactions)
        res.render('index.ejs', {
            transactions: transactions,
            pageTitle: 'ALL TRANSACTIONS'
        })
      }
    })
  })

//NEW route for new transaction
router.get('/new', (req, res) => {
  console.log(`In NEW route: ${req.body}`)
  res.render('new.ejs')
})

//POST route for creating a new transaction
router.post('/', (req, res) => {
  console.log(req.body)
  Transaction.create(req.body, (err, createdTransaction) => {
    if(err){
      console.log(err)
      res.send(err)
    } else {
      res.redirect('/transactions')
    }
  })
})

//Product DELETE route
router.delete('/:id', (req, res)=>{
  Transaction.findByIdAndRemove(req.params.id, (err, data)=>{
    res.redirect('/transactions')
  })
})
  
//Transaction SHOW route
router.get('/:id', (req, res) => {
    console.log(req.params.id)
    Transaction.findById(req.params.id, (err, foundTransaction) => {
      if(err){
        console.log(err, ': ERROR AT TRANSACTION SHOW ROUTE')
      } else {
        console.log(foundTransaction, ': SUCCESS, FOUND TRANSACTION FOR SHOW ROUTE')
        res.render('show.ejs', {
          transaction: foundTransaction,
          pageTitle: 'DISPLAY TRANSACTION'
        })
      }
    })
  })

//Transaction EDIT route
router.get('/:id/edit', (req, res) => {
  Transaction.findById(req.params.id, (err, foundTransaction) => {
    if(err){
      console.log(err, ' - ERROR AT TRANSACTION EDIT ROUTE')
    } else {
      res.render('edit.ejs', {
        transaction: foundTransaction,
          title: 'EDIT TRANSACTION'
      })
    }
  })
})

//Use this route to init some expense transactions
router.get('/seed', async (req, res) => {
    const newTransactions =
      [
        {
            date: 03/12/2022,
            description: 'business card',
            category : 'advertising',
            amount: 50,
            note: ''
            },
            {
            date: 06/12/2022,
            description: 'paper, pen, pencil',
            category : 'office supplies',
            amount: 50,
            note: ''
            },
            {
            date: 01/12/2022,
            description: 'ads, internet banner',
            category : 'advertising',
            amount: 500,
            note: ''
            },
            {
            date: 03/12/2022,
            description: 'attorney fee',
            category : 'legal and professional services',
            amount: 50,
            note: ''
            },
            {
            date: 09/12/2022,
            description: 'second phone line',
            category : 'utilities',
            amount: 50,
            note: '' 
            },
            {
            date: 03/12/2022,
            description: 'postage and shipping',
            category : 'advertising',
            amount: 50,
            note: ''
            },
            {
            date: 03/12/2022,
            description: 'tax preparation fee',
            category : 'legal and professional services',
            amount: 350,
            note: ''
            }
      ]
    try {
      const seedItems = await Transaction.create(newTransactions)
      res.send(seedItems)
    } catch (err) {
      res.send(err.message)
    }
  })


module.exports = router