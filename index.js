const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raufuprezensinc.hztjo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const booksCollection = client.db("paperback").collection("books");
    const bookings = client.db("paperback").collection("bookings");
    // const ordersCollection = client.db("emaJohn").collection("orders");

    app.post('/addProduct', (req, res) => {
        
        const newBook = req.body;
        

        // to insert one product

        booksCollection.insertOne(newBook)
            .then(result => {
                // res.redirect('/')
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })


        // bulk insert to database

        // booksCollection.insertMany(book)
        //     .then(result => {
        //         console.log(result.insertedCount);
        //         res.send(200).send(result.insertedCount)
        //     })

    })

    app.get('/products', (req, res) => {
        booksCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking)
            .then(result => {
                console.log(newBooking)
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/bookings',(req, res)=>{
        bookings.find({email:req.query.email})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })

});


app.listen(port)