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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    var values = Object.keys(books).map(function(key){
        return books[key];
    });
    res.send(JSON.stringify(values,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn],null,4));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const searchedAuthor = req.params.author;
    var authorValues = Object.values(books).filter(function(values){
        return values.author==searchedAuthor;
    });
    res.send(JSON.stringify(authorValues,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const searchedTitle = req.params.title;
    var titleValues = Object.values(books).filter(function(values){
        return values.title==searchedTitle;
    })
    res.send(JSON.stringify(titleValues,null,4))
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
