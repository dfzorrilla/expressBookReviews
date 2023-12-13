const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body);
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});



//
//public_users.get('/',function (req, res) {
//    var values = Object.keys(books).map(function(key){
//        return books[key];
//    });
//    res.send(JSON.stringify(values,null,4));
//});
//


let allBooksPromise = new Promise((resolve,reject) => {
    var values = Object.keys(books).map(function(key){
        return books[key];
    });
    resolve(values)
})

let isbnPromise = (isbn) => new Promise((resolve,reject) => {
    resolve(books[isbn])
})

let authorPromise = (searchedAuthor) => new Promise((resolve,reject) => {
    var authorValues = Object.values(books).filter(function(values){
        return values.author==searchedAuthor;
    });
    resolve(authorValues)
})

let titlePromise = (searchedTitle) => new Promise((resolve,reject) => {
    var titleValues = Object.values(books).filter(function(values){
        return values.title==searchedTitle;
    });
    resolve(titleValues)
})



// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Promise call
    allBooksPromise.then(
      (successMessage) => {
        res.send(JSON.stringify(successMessage, null, 4));
      },
      (error) => {
        res.status(500).send(null);
      }
    );
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    isbnPromise(isbn).then(
        (successMessage) => {
            res.send(JSON.stringify(successMessage,null,4));
        },
        (error) => {
          res.status(500).send(null);
        }
    );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const searchedAuthor = req.params.author;
    // Promise call
    authorPromise(searchedAuthor).then(
        (successMessage) => {
          res.send(JSON.stringify(successMessage, null, 4));
        },
        (error) => {
          res.status(500).send(null);
        }
      );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const searchedTitle = req.params.title;
    // Promise call
    titlePromise(searchedTitle).then(
        (successMessage) => {
          res.send(JSON.stringify(successMessage, null, 4));
        },
        (error) => {
          res.status(500).send(null);
        }
      );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const searchedIsbn = req.params.isbn;
  var isbnReviews = Object.values(books).filter(function(values){
    return values.reviews==searchedIsbn;
})
res.send(JSON.stringify(isbnReviews,null,4))
});

module.exports.general = public_users;
