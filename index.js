const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    //  admin/user/seller get
    app.get("/user/:role" ,async(req,res) => {
      const role = req.params.role;
      const query = {role :  role};
      const result = await usersCollection.find(query).toArray()
      res.send(result)
    })

    //  seller update verify
    app.put("/user/seller/:email" ,async(req,res) => {
      const email = req.params.email;
      const verify = req.body;
      const filter = {email :  email};
      const options = { upsert: true };
        const updateDoc = {
            $set: verify
        }
        const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // user or seller delete
    app.delete('/user/:email',async(req,res) => {
      const email = req.params.email;
      const query = {email : email};
      const result = await usersCollection.deleteOne(query);
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

    // get product by email
    app.get('/product/:email' , async(req,res) => {
      const email = req.params.email;
      const query = {sellerEmail : email}
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    })

  // product update
  app.put("/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = req.body;
    // console.log(product,id);
    const filter = {_id:ObjectId(id)};
    const options = { upsert: true };
    const updateDoc = {
        $set: product
    }
    const result = await productsCollection.updateOne(filter, updateDoc, options);
    res.send(result)
   })

  //  get product by multiple query 
  app.get('/products', async(req,res) => {
    const query = {
      available : "true",
      advertise : "true",
    }
    const result = await productsCollection.find(query).toArray();
    res.send(result)
  })

  // booking post
    app.post('/booking' , async(req,res)=> {
       const booking = req.body ;
       const query = {
        buyerEmail: booking.buyerEmail,
        productId: booking.productId
      }    
      const alreadyBooked = await bookingCollection.find(query).toArray();
      console.log(alreadyBooked);
      if (alreadyBooked.length) {
        const message = 'This product you already have a booked'
        return res.send({ acknowledged: false, message })
      }
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
