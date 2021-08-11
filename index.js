const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require('dotenv')
const bodyParser = require("body-parser");
const UserSchema = require("./mongoose");
const { json } = require("body-parser");
const app = express();
dotenv.config()
const URI = process.env.URI
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//connecting to the database
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database Connected");
    }
  }
);
//save the user info in the mongodb database
const SaveInDatabase = (username, name, password) => {
  const NewUser = new UserSchema({
    username: username,
    name: name,
    password: password,
  });

  NewUser.save()
    .then((doc) => {
      console.log(doc);
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};
//get  for /login
app.post("/login", (req, res) => {
  username = req.body.username;
  password = req.body.password;
  UserSchema.findOne(
    {
      username: username,
    },
    (err, Users) => {
      if (err) console.log(err);
      else {
        //if username is not null we have to compare the hashed password and the user password
        bcrypt.compare(password, Users.password, (err, result) => {
          console.log(result)
          console.log(Users.password)
          console.log(Users)
          if (err) console.log(err);
          else {
            if (result == true) {
              console.log("User Authenticated");
              res.send("authetication Done")
            } else {
              console.log("Authetication Fail");
              res.send("user Not found");
            }
          }
        });
      }
    }
  );
});

//post for /signup
app.post("/signup" ,(req, res) => {
  const username = req.body.username;
  const name = req.body.name ;
  const passwod = req.body.password;
  if (username != null && passwod != null) {
    bcrypt.genSalt(10,(salterr,salt)=>{
      if(salterr) console.log(alterr)
      else{
      bcrypt.hash(passwod,salt,(err,hash)=>{
        if(err) console.log(err)
        else{
          SaveInDatabase(username,name,hash)
          res.send("Done")
        }
      })}
    })
  }else{
    res.send("Proplem With User Input")
  }
});

//server connection
app.listen(5000, (err) => {
  if (err) console.log(err);
  else {
    console.log("Server Connected to 5000");
  }
});
