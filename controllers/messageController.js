
// hello

let hello = (req, res) => {
   console.log("This is hello from the messageController")
   res.send("Hello there")
}

// privateHello
let privateHello = (req, res) => {

   let fullName = req.userInfo.fullName;
   let userId = req.userInfo.userId;

   console.log("private hello in message controller")
   res.send("Hello there, you are logged in as " + fullName + " with user id " + userId)
}

module.exports = {hello, privateHello}