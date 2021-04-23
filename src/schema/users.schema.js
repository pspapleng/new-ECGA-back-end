const Joi = require("joi");

const passwordValidator = (value, helpers) => {
  if (value.length < 8) {
    throw new Joi.ValidationError(
      "Password must contain at least 8 characters"
    );
  }
  if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
    throw new Joi.ValidationError("Password must be harder");
  }
  return value;
};

const usersSchema = Joi.object({
  u_fname: Joi.string().required(),
  u_lname: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  gender: Joi.string().required(),
  height: Joi.string().required(),
  weight: Joi.string().required(),
  bmi: Joi.string().required(),
  waistline: Joi.string().required(),
  fall_history: Joi.string().required(),
  n_id: Joi.string().required(),
});

module.exports = usersSchema;
