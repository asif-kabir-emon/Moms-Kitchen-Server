const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mom's Kitchen Server is running");
});

const uri = "mongodb://localhost:27017";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@userc1.twqeubr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const foodCollection = client.db("MomsKitchen").collection("foods");

    app.get("/foods", async (req, res) => {
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = foodCollection.find(query);
      const foods = await cursor.limit(size).toArray();
      const count = await foodCollection.estimatedDocumentCount();
      res.send({ count, foods });
    });

    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await foodCollection.findOne(query);
      res.send(food);
    });

    app.post("/foods", async (req, res) => {
      const food = req.body;
      const add = await foodCollection.insertOne(food);
      res.send(add);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
