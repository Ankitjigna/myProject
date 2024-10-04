const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/duniya");
}
main()
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '67002253e37f6d31c06e24e9',
  }));
  await listing.insertMany(initData.data);
  console.log("data loaded");
};
initDb();
