const express = require('express');

const db = require("./userDb")
const postDb = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const newUser = req.body
db.insert(newUser)
.then(user => {
    res.status(201).json(user)
})
.catch(err => {
    res.status(500).json({message: "Error creating new user", err})
})
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
db.get()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({message: "Error retrieving data", err})
    })
});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    db.getById(id)
      .then(post => {
        post
          ? ((req.post = post), next())
          : res
              .status(404)
              .json({ message: `Post with id ${id} could not be found` });
      })
      .catch(err => {
        res.status(500).json({ message: "Error retrieving data", error });
      });
};

function validateUser(req, res, next) {
    const bodyInfo = req.body;
    bodyInfo.name ? next() : res.status(400).json({messsage: "Missing name on body"})
};

function validatePost(req, res, next) {
    const bodyInfo = req.body;
    bodyInfo.text ? next() : res.status(400).json({message: "Missing text on body"})
};

module.exports = router;
