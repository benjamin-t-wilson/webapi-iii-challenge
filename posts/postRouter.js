const express = require('express');
const db = require("./postDb")

const router = express.Router();

router.get('/', (req, res) => {
db.get()
.then(posts => {
    res.status(200).json(posts)
})
.catch(err => {
    res.status(500).json({ message: "Error retrieving data", err})
})
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    db.getById(id)
    .then(post => {
        post ? (
            req.post = post,
            next()
        ) : res.status(404).json({message: `Post with id ${id} could not be found`})
    })
    .catch(err => {
        res.status(500).json({message: "Error retrieving data", error})
    })

};

module.exports = router;