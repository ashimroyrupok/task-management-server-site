require('dotenv').config()
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;







// cors middleware
app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}))
app.use(express.json())


// console.log(process.env.DB_USER, process.env.DB_PASS ,"passs");
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwnroha.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db('taskDB').collection('users')
    const tasksCollection = client.db('taskDB').collection('tasks');


    app.post('/task', async(req,res)=> {
      const data = req.body;
      console.log(data);
      const result = await tasksCollection.insertOne(data);
      res.send(result)
    })

    app.get('/task/:email', async(req,res)=> {
      const email = req.params.email;
      // const query = { email: email , taskStatus:"toDo" }
      const query= {
        $and:[
          { email: email},
          {taskStatus:"toDo"}
        ]
      };
      const result = await tasksCollection.find(query).toArray();
      res.send(result)
    })
    app.get('/tasks/onGoing/:email', async(req,res)=> {
      const email = req.params.email;
      const query = {
        $and: [
          { email: email },
          { taskStatus: "onGoing" }
        ]
      };
      const result = await tasksCollection.find(query).toArray();
      res.send(result)
    })


    app.post('/users', async (req, res) => {
      const data = req.body;
      console.log(data);
      const query = { email: data.email }
      const existUser = await usersCollection.findOne(query)
      if (existUser) {
        return res.send({ user: "user is already exist", insertedId: null })
      }
      const result = await usersCollection.insertOne(data);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', async (req, res) => {
  res.send("task management is available")
})

// listen the running port
app.listen(port, () => {
  console.log(`task management is available on port ${port}`);
})