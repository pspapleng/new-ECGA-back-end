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

// const resultIdValidator = async (value, helpers) => {
//   const [rows, _] = await config.query(
//     "SELECT result_id FROM form_result order by result_id desc limit 1"
//   );
//   let id = rows[0];
//   return value.replace("", id);
// };

const ansSchema = Joi.array()
  .required()
  .length(163)
  .items(
    Joi.object({
      ans_title: Joi.string().required(),
      ans_value: Joi.number().required(),
      ques_id: Joi.number().required().min(1).max(163),
      u_id: Joi.number().required().external(uIdValidator),
      result_id: Joi.string().allow(""),
      // result_id: Joi.string().external(resultIdValidator),
    })
  );

module.exports = ansSchema;
