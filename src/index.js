const express = require("express");
const config = require("./server/config");

//database
require("./database");

const app = config(express());

//Starting the server
app.listen(app.get("port"), () =>
  console.log(`Example app listening on port ${app.get("port")}!`)
);
