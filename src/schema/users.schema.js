const Joi = require("joi");
const { config } = require("../configs/pg.config");

const nIdValidator = async (value, helpers) => {
  const [rows, _] = await config.query(
    "SELECT n_id FROM nurse WHERE n_id = ?",
    [value]
  );
  if (rows.length <= 0) {
    const message = "Don't have this nurse na ka";
    throw new Joi.ValidationError(message, { message });
  }
  return value;
};

const usersSchema = Joi.object({
  u_fname: Joi.string()
    .required()
    .min(2)
    .max(20)
    .regex(/^[ก-์a-zA-Z]*$/),
  u_lname: Joi.string()
    .required()
    .min(2)
    .max(20)
    .regex(/^[ก-์a-zA-Z]*$/),
  date_of_birth: Joi.date().required().less("now"),
  gender: Joi.number().integer().required().min(1).max(2),
  height: Joi.string()
    .required()
    .regex(/^(?![-,.,0])\d+[.,0-9]\d{0,2}$/)
    .min(3),
  weight: Joi.string()
    .required()
    .regex(/^(?![-,.,0])\d+[.,0-9]\d{0,2}$/)
    .min(2),
  bmi: Joi.string()
    .required()
    .regex(/^(?![-,.,0])\d+[.,0-9]\d{0,2}$/)
    .min(1),
  waistline: Joi.string()
    .required()
    .regex(/^(?![-,.,0])\d+[.,0-9]\d{0,2}$/)
    .min(1),
  fall_history: Joi.number().integer().required(),
  n_id: Joi.number().integer().required().external(nIdValidator),
});

module.exports = usersSchema;
