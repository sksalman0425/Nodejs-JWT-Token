const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretkey";
//below code is just to check get api is running properly or not

// app.get("/",(req,resp)=>{
//     resp.json({
//         message:" a simple api"
//     })
// })

// below code generate token
app.post("/login", (req, resp) => {
  const user = {
    id: 111,
    username: "anil",
    email: "test@gmail.com",
  };
  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    resp.json({
      token,
    });
  });
});
app.post("/profile", verifyToken, (req, resp) => {
  //jwt.verify() function verify token
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      resp.send({ result: "invalid token" });
    } else {
      resp.json({
        message: "profile Accessed",
        authData,
      });
    }
  });
});

//below function acts as middleware. it only extract token and send it to app.post("/profile") for verification
function verifyToken(req, resp, next) {
  const bearerHeader = req.headers["authorization"]; // remember authorization in small letter
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" "); //here we spliting the string and getting only token not bearer keyword
    const token = bearer[1];
    req.token = token;
    next(); //this gives the control to next function i.e. arrow function after verifyToken callback function
  } else {
    resp.send({
      result: "Token is not valid",
    });
  }
}
//2nd arg i.e.arrow function in listen() show output on browser
app.listen(5000, () => {
  console.log("app is running on 5000 port");
});
