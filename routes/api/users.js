const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrpyt = require("bcryptjs");

const User = require("../../models/User");

router.get("/test", (req, res) =>
  res.json({
    msg: "Users OK"
  })
);

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email already in use" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrpyt.genSalt(10, (err, salt) => {
        bcrpyt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.error(err));
        });
      });
    }
  });
});

module.exports = router;
