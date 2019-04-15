const isEmpty = require("./is_empty");
const Validator = require("validator");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.institution = !isEmpty(data.institution) ? data.institution : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.to) ? data.to : "";

  if (Validator.isEmpty(data.institution)) {
    errors.institution = "Institution field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "Education start date field is required";
  }

  if (Validator.isEmpty(data.to)) {
    errors.to = "Education end date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
