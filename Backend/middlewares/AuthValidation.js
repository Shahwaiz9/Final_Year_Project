import joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(100).required(),
    email: joi.string().min(6).max(100).required().email(),
    password: joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};

export const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().min(6).max(100).required().email(),
    password: joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    next();
  }
};
