const { body, validationResult } = require("express-validator");

const resumeValidationRules = [
  body("personalInfo.fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Name too long"),

  body("personalInfo.email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("personalInfo.phone")
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[+]?[\d\s\-().]{7,20}$/)
    .withMessage("Invalid phone format"),

  body("personalInfo.objective")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Objective too long (max 1000 chars)"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("experience")
    .optional()
    .isArray()
    .withMessage("Experience must be an array"),

  body("education")
    .optional()
    .isArray()
    .withMessage("Education must be an array"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { resumeValidationRules, validate };
