const express = require("express");

const path = require('path');

const usersRouter = require('./routers/users');

const app = express();

const port = process.env.PORT || 4001;  // you change if you have a conflict

app.use(express.static('public'));

app.use(express.json());


app.use('/users', usersRouter)

app.get('/', (req, res) => {
  //res.send('Welcome to our server!')
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(port, () => {
 console.log(`Web server is listening on port ${port}!`);
});
