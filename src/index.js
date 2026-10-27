const express = require("express");
const users = require('./routes/users.routes');
const posts = require('./routes/posts.routes');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ "status": "OK" });
});

app.use('/users', users);
app.use('/posts', posts);


app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});