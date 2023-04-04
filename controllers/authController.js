const db = require('../sql/connection');
let argon2 = require("argon2");
let jwt = require("jsonwebtoken");


let register = async (req, res) => {

   let username = req.body.username;
   let password = req.body.password;
   let fullName = req.body.fullName;

   let passwordHash;

   try {
      // hash the password
      passwordHash = await argon2.hash(password);

   } catch(err) {
      console.log(err);
      if(err.code == "ER_DUP_ENTRY") {
         res.status(400).send("That username is taken. Please try again.")
      } else {
         res.sendStatus(500);
      }
      return;
   }

   let params =[username, passwordHash, fullName];
   let sql = "insert into regUser (username, password_hash, full_name) values (?, ?, ?)"

   try {
      let results = await db.queryPromise(sql, params);  
      res.sendStatus(200);
   } catch(err) {
      console.log(err);
      if(err.code == "ER_DUP_ENTRY") {
         res.status(400).send("That username is taken. Please try again.")
      } else {
         res.sendStatus(500);
      }
      
      return;
   }

}

// we have a register user, and now they want to log in
//if good, yes here's your token, or no I got nothing for you
let login = (req, res) => {

   let username = req.body.username;
   let password = req.body.password;
   let sql = "select id, full_name, password_hash from regUser where username = ?";
   let params = [username];

   db.query(sql, params, async (err, rows) => {
      if(err) {
         console.log("Could not get user ", err)
         res.sendStatus(500)
      } else {
         if(rows.length > 1) {
            console.log("Returned too many rows for username ", username)
            res.sendStatus(500);
         } else if(rows.length == 0) {
            console.log("Username does not exist");
            res.status(400).send("That username does not exist. Please sign up for an account.")
         } else {           
            let pwHash = rows[0].password_hash;
            let fnName = rows[0].full_name;
            let userId = rows[0].id;

            let goodPass = false;

            try {
               goodPass = await argon2.verify(pwHash, password);  // returns a boolean, so if the hash verified, goodPass = true
            } catch(err) {
               console.log("Failed to verify password ", err);
               res.status(400).send("Invalid password");
            }

            if(goodPass){
               
               let token = {
                  "fullName": fnName,
                  "userId": userId  // usually want the bare minimum of key/value
               }

               //res.json(token); // unsigned token JUST A TEST

               // now we need to sign the token
               let signedToken = jwt.sign(token, process.env.JWT_SECRET);

               // res.json(signedToken); // crashes after you use this once
               // token for id 1 for testing
               // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlJvYmluIERpbGxhcmQiLCJ1c2VySWQiOjEsImlhdCI6MTY4MDYxMDUwN30.3iKqq4pOC60cJZqFsZarzZDLjJv2i_kvbAFHmTYWLKI
               // res.setHeeader("Authorization", "Bearer ", signedToken) // i don't have a client(front end) to send it to
               
               res.sendStatus(200)

            } else {
               res.sendStatus(400)
            }

         } // end else
      } 
   })
} // end login function


module.exports = {register, login}