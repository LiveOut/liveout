const isEmpty = require("./is_empty");
const Validator = require("validator");

module.exports = function validateResidenceInput(data) {
  let errors = {};

  data.type = !isEmpty(data.type) ? data.type : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.to) ? data.to : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.type)) {
    errors.type = "Residence type field is required";
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = "Residence address field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "Residence start date field is required";
  }

  if (Validator.isEmpty(data.to)) {
    errors.to = "Residence end date field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Residence description field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
