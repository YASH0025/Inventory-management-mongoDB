import { check, validationResult } from 'express-validator';

const validateEmail = check('email', 'Invalid email').isEmail();
const validatePassword = check('password', 'Password should be at least 6 characters long').isLength({ min: 6 });
const validateName = check('name', 'Name is required with atleast 3 character').not().isEmpty().isLength({ min: 3 });
const validatePhoneNumber = check('phoneNumber', 'Phone number is required').not().isEmpty().isLength({ min: 10 });
const validateCity = check('address.city', 'City is required').not().isEmpty();
const validateState = check('address.state', 'State is required').not().isEmpty();
const validateNewPassword = check('newPassword', 'New password is required & should be at least 6 characters long').not().isEmpty().isLength({ min: 6 });


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({ message: error.msg }));
        return res.status(422).json({ errors: errorMessages });
    }
    next();
};

const validate = {
    signUpValidator: [
        validateName,
        validateEmail,
        validatePassword,
        validatePhoneNumber,
        validateCity,
        validateState,
        handleValidationErrors
    ],
    updateInfoValidator: [
        validateName,
        validatePhoneNumber,
        validateCity,
        validateState,
        handleValidationErrors
    ],
    logInValidator: [
        validateEmail,
        validatePassword,
        handleValidationErrors
    ],
    forgetPasswordValidator: [
        validateEmail,
        handleValidationErrors
    ],
    resetPasswordValidator: [

        validateNewPassword,
        handleValidationErrors
    ]
};

export default validate;
