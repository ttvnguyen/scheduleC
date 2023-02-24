const express = require('express')
const Transaction = require('../models/transactions.js')
const router = express.Router()
const moment = require('moment')
const isAuthenticated = require('../utils/middleware.js')

//Test router calling route
// router.get('/', (req, res) =>{
//     res.send('This is the transactions controller')
// })

router.use(isAuthenticated)
// console.log(`User can access: ${isAuthenticated}`)

//Transaction index route
router.get('/', (req, res) => {
    // res.render('index.ejs')
    console.log(`User Name: ${req.session.currentUser.username}`)
    Transaction.find({username: req.session.currentUser.username},(err, transactions) => {
      // console.log(`Any transactions: ${transactions}`)
      if(err){
        console.log(err, ': ERROR IN INDEX ROUTE QUERY')
      } else {
        // console.log(transactions)
        res.render('index.ejs', {
          transactions: transactions,
          currentUser: req.session.currentUser,
          pageTitle: 'ALL TRANSACTIONS'
        })
      }
    })
  })

//NEW route for new transaction
router.get('/new', isAuthenticated,(req, res) => {
  console.log(`In NEW route: ${req.session.currentUser.username}`)
  res.render('new.ejs',{
    currentUser: req.session.currentUser,
    todayDate:moment(Date.now()).format('YYYY-MM-DD')
  })
  
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
//Transaction Report route
router.get('/report', (req, res) => {
  // res.render('index.ejs')
  Transaction.find({username: req.session.currentUser.username},(err, transactions) => {
    if(err){
      console.log(err, ': ERROR IN REPORT ROUTE QUERY')
    } else {
      // console.log(transactions)
      res.render('report.ejs', {
          transactions: transactions,
          currentUser: req.session.currentUser,
          pageTitle: 'SUM TRANSACTIONS PER CATEGORY'
      })
    }
  })
})

//Transaction DELETE route
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
          trdate:moment(foundTransaction.date).format('YYYY-MM-DD'),
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
        currentUser: req.session.currentUser,
        trdate:moment(foundTransaction.date).format('YYYY-MM-DD'),
          title: 'EDIT TRANSACTION'
      })
    }
  })
})

//Create an put route for editing the transaction
router.put('/:id', (req, res) =>{
  // res.send(req.body)
  Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedProduct)=>{
    if (err) console.log(err, 'ERROR at PUT ROUTE')
    res.redirect('/transactions')
  })
})
//Use this route to init some expense transactions
router.get('/seed', async (req, res) => {
    const newTransactions =
      [
        {
          username:'vnguyen',
            date: 03/12/2022,
            description: 'business card',
            category : 'Advertising',
            amount: 50,
            note: ''
            },
            {
            username:'vnguyen',
            date: 06/12/2022,
            description: 'paper, pen, pencil',
            category : 'Office Supplies',
            amount: 50,
            note: ''
            },
            {
            username:'vnguyen',
            date: 01/12/2022,
            description: 'ads, internet banner',
            category : 'Advertising',
            amount: 500,
            note: ''
            },
            {
            username:'vnguyen',
            date: 03/12/2022,
            description: 'attorney fee',
            category : 'Legal',
            amount: 50,
            note: ''
            },
            {
            username:'vnguyen',
            date: 09/12/2022,
            description: 'second phone line',
            category : 'Utilities',
            amount: 50,
            note: '' 
            },
            {
            username:'vnguyen',
            date: 03/12/2022,
            description: 'postage and shipping',
            category : 'Advertising',
            amount: 50,
            note: ''
            },
            {
            username:'vnguyen',
            date: 03/12/2022,
            description: 'tax preparation fee',
            category : 'Legal',
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