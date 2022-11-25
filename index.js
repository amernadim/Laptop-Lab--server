const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middle wares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.p2qoups.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const usersCollection = client.db("laptopLab").collection("users");
    const categoryCollection = client.db("laptopLab").collection("categorys");
    const productsCollection = client.db("laptopLab").collection("products");
    const bookingCollection = client.db("laptopLab").collection("booking");


  // user info insert
  app.put("/user/:email", async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: user
        }
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.send(result)
     })

    //  category get
    app.get('/categories', async(req,res) => {
      const query = {} ;
      const result = await categoryCollection.find(query).toArray();
      res.send(result)
    })

    // get product by product id
    app.get('/category/:id',async(req,res)=> {
      const id = req.params.id;
      const query = {categoryId : id};
      const result = await productsCollection.find(query).toArray()
      res.send(result)
    })

    // post product 
    app.post('/product', async(req,res)=> {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })

    // booking post
    app.post('/booking' , async(req,res)=> {
       const booking = req.body ;
       const result = await bookingCollection.insertOne(booking);
       res.send(result)
    })

    // get my order by email
    app.get("/booking/:email", async(req,res) => {
      const email = req.params.email;
      const query = {buyerEmail : email}
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })


  }
  finally {
  }
}

run().catch(error => console.error(error))

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
