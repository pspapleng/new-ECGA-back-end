const Joi = require("joi");
const { config } = require("../configs/pg.config");

const uIdValidator = async (value, helpers) => {
  const [rows, _] = await config.query(
    "SELECT u_id FROM users WHERE u_id = ?",
    [value]
  );
  if (!rows.length > 0) {
    const message = "Don't have this users na ka";
    throw new Joi.ValidationError(message, { message });
  }
  return value;
};

const ansSchema = Joi.array()
  .required()
  .length(162)
  .items(
    Joi.object({
      ans_title: Joi.string().required(),
      ans_value: Joi.number().required(),
      ans_time: Joi.date().required(),
      ques_id: Joi.number().required().min(1).max(162),
      u_id: Joi.number().required().external(uIdValidator),
    })
  );

module.exports = ansSchema;
