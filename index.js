const express = require("express");

const path = require('path');

const usersRouter = require('./routers/users');
const authRoutes = require("./routers/authRoutes");
const msgRoutes = require("./routers/messageRoutes");

const app = express();

const port = process.env.PORT || 4001;  // change if you have a conflict

app.use(express.static('public'));

app.use(express.json());

app.use('/', authRoutes);  
app.use('/', msgRoutes);  
app.use('/users', usersRouter);



app.get('/', (req, res) => {
  //res.send('Welcome to our server!')
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(port, () => {
 console.log(`Web server is listening on port ${port}!`);
});
