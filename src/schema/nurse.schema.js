const Joi = require("joi");
const { config } = require("../configs/pg.config");

const idValidator = async (value, helpers) => {
  const [rows, _] = await config.query("SELECT ID FROM nurse WHERE ID = ?", [
    value,
  ]);
  console.log(rows);
  if (rows.length > 0) {
    const message = "This ID is already have";
    throw new Joi.ValidationError(message, { message });
  }
  if (!value.match(/^ว+\d{11}$/)) {
    ///^ว+\d{11}$/
    const message = "ID must contain 11 characters or ID invalid";
    throw new Joi.ValidationError(message, { message });
  }
  return value;
};

const usernameValidator = async (value, helpers) => {
  const [
    rows,
    _,
  ] = await config.query("SELECT username FROM nurse WHERE username = ?", [
    value,
  ]);
  if (rows.length > 0) {
    const message = "This username is already taken";
    throw new Joi.ValidationError(message, { message });
  }
  return value;
};

const passwordValidator = (value, helpers) => {
  if (value.length < 6) {
    throw new Joi.ValidationError(
      "Password must contain at least 6 characters"
    );
  }
  if (!(value.match(/[a-z]/) && value.match(/[0-9]/))) {
    throw new Joi.ValidationError("Password must be harder");
  }
  return value;
};

const nurseSchema = Joi.object({
  ID: Joi.string().required().external(idValidator),
  n_fname: Joi.string()
    .required()
    .min(2)
    .max(20)
    .regex(/^[ก-์a-zA-Z]*$/),
  n_lname: Joi.string()
    .required()
    .min(2)
    .max(20)
    .regex(/^[ก-์a-zA-Z]*$/),
  username: Joi.string().required().min(5).max(15).external(usernameValidator),
  password: Joi.string().required().custom(passwordValidator),
  confirm_password: Joi.string().required().valid(Joi.ref("password")),
});

module.exports = nurseSchema;
