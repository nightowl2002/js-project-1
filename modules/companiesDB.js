const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jatinjaglan9813958961:OwrqNroxKYUZ5pMS@cluster0.gqcskah.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const companySchema = new Schema({
  "name": String,
  "permalink": String,
  "crunchbase_url": String,
  "homepage_url": String,
  "blog_url": String,
  "blog_feed_url": String,
  "twitter_username": String,
  "category_code": String,
  "number_of_employees": Number,
  "founded_year": Number,
  "founded_month": Number,
  "founded_day": Number,
  "deadpooled_year": Number,
  "deadpooled_month": Number,
  "deadpooled_day": Number,
  "deadpooled_url": String,
  "tag_list": String,
  "alias_list": String,
  "email_address": String,
  "phone_number": String,
  "description": String,

  "overview": String,
  "image": {},
  "products": [],
  "relationships": [],
  "competitions": [],
  "providerships": [],
  "total_money_raised": String,
  "funding_rounds": [],
  "investments": [],
  "acquisition": {},
  "acquisitions": [],
  "offices": [],
  "milestones": [],
  "ipo": {},
  "video_embeds": [],
  "screenshots": [],
  "external_links": [{
    "external_url": String,
    "title": String
  }],
  "partners": []
});

module.exports = class CompaniesDB {
  constructor() {
    this.Company = null;
  }

  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(
        connectionString,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Company = db.model("companies", companySchema);
        resolve();
      });
    });
  }

  async addNewCompany(data) {
    const newCompany = new this.Company(data);
    await newCompany.save();
    return newCompany;
  }

  getAllCompanies(page, perPage, name) {
    let findBy = name ? { name: new RegExp(name, "i") } : {};

    if (+page && +perPage) {
      return this.Company.find(findBy).sort({ founded_year: -1, founded_month: -1, founded_day: -1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  getCompanyById(id) {
    return this.Company.findOne({ _id: id }).exec();
    // return this.Company.findOne({ name: new RegExp('^' + name + '$', "i") }).exec();
  }

  updateCompanyById(data, id) {
    return this.Company.updateOne({ _id: id }, { $set: data }).exec();
  }

  deleteCompanyById(id) {
    return this.Company.deleteOne({ _id: id }).exec();
  }
}
