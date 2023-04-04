let jwt = require("jsonwebtoken")

let checkJWT = (req, res, next) => {

   let headerValue = req.get("Authorization")

   let signedToken;

   if(headerValue){
      // Bearer token has 2 parts
      let parts = headerValue.split(" ");
      signedToken = parts[1];
   }

   if(!signedToken) {
      console.log("Missing signed token");
      res.sendStatus(403);
      return;
   }
   // if i get to this line, verify the secret

   try {
      
      let unsigned = jwt.verify(signedToken, process.env.JWT_SECRET)

      // define a var in the req object and stuffing the 
      // info from the authController token into the req object
      // so I can use it in the next step in the chain
      
      req.userInfo = unsigned; 

   } catch(err) {
      console.log("Failed to verify token ", err)
      res.sendStatus(403)
      return;
   }

   // if we get here, it's a valid token, so go to the next task in the chain
   
   next();

}

module.exports = {checkJWT}