import { check } from "express-validator";

const name = check("name", "Name is required.").not().isEmpty();
const username = check("username", "Username is required.").not().isEmpty();
const password = check("password", "Password is required of minimum length of 6.").isLength({min:6});
const email = check("email", "Please provide a valid email address.").isEmail();

export const RegisterValidations = [password, name, username, email];
export const AuthentionValidations = [username, password];
export const ResetPassword = [email];