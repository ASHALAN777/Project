const Joi = require("joi");

const signupvalidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required(),
    age: Joi.number().optional(),
     adminCode: Joi.string(),
    role: Joi.string().valid("Admin", "Employee").default("Employee")
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  req.body = value;
  next();
};

const loginvalidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  req.body = value;
  next();
};

module.exports = { signupvalidation, loginvalidation };
