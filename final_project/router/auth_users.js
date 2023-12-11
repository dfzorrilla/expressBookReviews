const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (userInput)=>{ 
    let userswithsamename = users.filter((userFilter)=>{
        return userFilter.username === userInput
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ 
    let validUsers = users.filter((userFilter)=>{
        return (userFilter.username === username && userFilter.password === password)
      });
      if(validUsers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const searchedIsbn = req.params.isbn;
  let filteredISBN = books[searchedIsbn];
  let sessionUsername = req.session.authorization.username;
  let newReview = req.query.review;
  console.log("Params: "+req.params);
  console.log("Query: "+ req.query);
  console.log(req.session.authorization.username);
    if (filteredISBN) {
        var reviewBody = {
            username:sessionUsername,
            review:newReview
        }
    console.log(filteredISBN.reviews.length)
        //if the review has changed
        if(filteredISBN.reviews.length==0) {
            let reviews=[]
            reviews.push(reviewBody);
            filteredISBN.reviews = reviews;
        }else{
            filteredISBN.reviews.push(reviewBody);
        }

        res.send(`Review `+req.query.review+ ` from `+req.session.authorization.username+` was posted.`);
    }
    else{
        res.send("Unable to find user!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const searchedIsbn = req.params.isbn;
    let filteredISBN = books[searchedIsbn];
    let sessionUsername = req.session.authorization.username;
    if(!filteredISBN){
        res.send("ISBN Not found");
    }
    let counter=0;

    let newArray = filteredISBN.reviews.filter((currentReview)=>{
        if(currentReview.username!=sessionUsername){
            return true;
        }
        counter=counter+1;
        return false;
    });

    filteredISBN.reviews=newArray;

    


    res.send(counter+` Reviews for book with ISBN `+req.params.isbn+` was/were deleted for the user `+sessionUsername);
    

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
