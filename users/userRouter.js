const express = require("express");

const db = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const newUser = req.body;
  db.insert(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Error creating new user", err });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newPost = req.body;
  newPost.user_id = req.params.id;
  postDb
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: "Error creating new post", err });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving data", err });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  db.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving user", err });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving user posts", err });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({ message: "Error deleting user", err });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const updateInfo = req.body;
  db.update(req.params.id, updateInfo)
    .then(() => {
      db.getById(req.params.id)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res
            .status(500)
            .json({ message: "Error retrieving updated user file", err });
        });
    })
    .catch(err => {
      res.status(500).json({ message: "Error updating user", err });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  db.getById(id)
    .then(user => {
      user
        ? ((req.user = user), next())
        : res
            .status(404)
            .json({ message: `User with id ${id} could not be found` });
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving data", error });
    });
}

function validateUser(req, res, next) {
  const bodyInfo = req.body;
  bodyInfo.name
    ? next()
    : res.status(400).json({ messsage: "Missing name on body" });
}

function validatePost(req, res, next) {
  const bodyInfo = req.body;
  bodyInfo.text
    ? next()
    : res.status(400).json({ message: "Missing text on body" });
}

module.exports = router;
