const express = require("express");
const users = require('./routes/users.routes')
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ "status": "OK" });
});

app.use('/users', users)


app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});