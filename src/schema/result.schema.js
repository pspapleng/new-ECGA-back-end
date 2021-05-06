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

const resultSchema = Joi.object({
  result: Joi.object().required().length(13).keys({
    MNA: Joi.string(),
    OCA: Joi.string(),
    FallRisk: Joi.string(),
    TUGT: Joi.string(),
    EYES: Joi.string(),
    TGDS15: Joi.string(),
    IQCODE: Joi.string(),
    MMSE: Joi.string(),
    LTTA: Joi.string(),
    UIA: Joi.string(),
    SLEEP: Joi.string(),
    KNEE: Joi.string(),
    OSTA: Joi.string(),
  }),
  u_id: Joi.number().integer().required().external(uIdValidator),
});

module.exports = resultSchema;
