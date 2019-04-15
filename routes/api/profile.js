const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load profile and user model and validators
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const validateProfileInput = require("../../validation/profile");
const validateResidenceInput = require("../../validation/residence");
const validateEducationInput = require("../../validation/education");

router.get("/test", (req, res) =>
  res.json({
    msg: "Profile OK"
  })
);

/**
 * GET profile
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

router.get("/handle/:handle", (req, res) => {
  let errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(errors);
    });
});

router.get("/user/:user_id", (req, res) => {
  let errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => {
      res.status(404).json({ profile: "There is no profile for this user" });
    });
});

router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profile: "There are no profiles to fetch" });
    });
});

/**
 * POST create or edit profile
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => {
              res.status(404).json(err);
            });
        } else {
          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle })
            .then(profile => {
              if (profile) {
                errors.handle = "That handle already exists";
                res.status(400).json(errors);
              } else {
                new Profile(profileFields)
                  .save()
                  .then(profile => res.json(profile));
              }
            })
            .catch(err => {
              res.status(404).json(err);
            });
        }
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

/**
 * @route POST add Residence
 */

router.post(
  "/residences",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateResidenceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    //console.log(req.user.id);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newRes = {
          type: req.body.type,
          address: req.body.address,
          from: req.body.from,
          to: req.body.to,
          description: req.body.descrtiption
        };

        profile.residences.unshift(newRes);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

/**
 * @route POST add Education
 */

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    //console.log(req.user.id);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          institution: req.body.institution,
          from: new Date(req.body.from),
          to: new Date(req.body.to)
        };

        profile.education.unshift(newEdu);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

/**
 * @route DELETE residence from profile
 */

router.delete(
  "/residences/:res_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.user.id);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove idx
        const remove_idx = profile.residences
          .map(item => item.id)
          .indexOf(req.params.res_id);

        profile.residences.splice(remove_idx, 1);

        profile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

/**
 * @route DELETE education from profile
 */

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.user.id);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove idx
        const remove_idx = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        profile.education.splice(remove_idx, 1);

        profile
          .save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

/**
 * @route DELETE user and profile
 */

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
