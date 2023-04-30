import { ObjectId } from "mongodb";
import { badRequestError } from "./wrappers.js";

const validateString = (userInput, inputParameter) => {
  /**
   * @param {userInput} string
   * @param {inputParameter} string
   * @throws {MissingInput}
   */
  if (!userInput) throw badRequestError(`Please provide ${inputParameter}!`);
  if (typeof userInput !== "string" || typeof userInput === undefined) {
    throw badRequestError(`${inputParameter} must be a string!`);
  }
  if (userInput.trim().length === 0)
    throw badRequestError(
      inputParameter + " cannot be an empty string or string with just spaces!"
    );
};

const validateObjectId = (inputId, inputParameter) => {
  /**
   * @param {inputId} string
   * @param {inputParameter} string
   * @throws {MissingInput}
   * @throws {InvalidObjectID}
   */
  if (!inputId) throw badRequestError(`Please provide ${inputParameter}!`);
  if (typeof inputId !== "string" || typeof inputId === undefined)
    throw badRequestError(inputParameter + " must be a string!");
  if (inputId.trim().length === 0)
    throw badRequestError(
      inputParameter + " cannot be an empty string or just spaces!"
    );

  if (!ObjectId.isValid(inputId.trim()))
    throw badRequestError(`Invalid ${inputParameter}!`);
};
const validateName = (inputName, inputParameter) => {
  /**
   * @param {inputName} string
   * @param {inputParameter} string
   */
  if (!inputName) throw badRequestError(`Please provide ${inputParameter}!`);
  if (typeof inputName !== "string" || typeof inputName === undefined)
    throw badRequestError(inputParameter + " must be a string!");
  if (inputName.trim().length === 0)
    throw badRequestError(
      inputParameter + " cannot be an empty string or string with just spaces!"
    );
  const name = inputName.trim().split(" ");
  if (name.length > 1) {
    throw badRequestError(inputParameter + " should be in valid format!");
  } else {
    let format = /[`0123456789!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/;
    if (inputName.length < 2 || format.test(inputName)) {
      throw badRequestError(
        inputParameter +
          " must be atleast 2 characters long and should not contain any special characters or numbers!"
      );
    }
  }
};

const validatePostTitle = (postTitle, inputParameter) => {
  /**
   * @param {postTitle} string
   * @param {inputParameter} string
   */
  if (!postTitle) throw badRequestError(`Please provide ${inputParameter}!`);
  if (typeof postTitle !== "string" || typeof postTitle === undefined)
    throw badRequestError(inputParameter + " must be a string!");
  if (postTitle.trim().length === 0)
    throw badRequestError(
      inputParameter + " cannot be an empty string or string with just spaces!"
    );
    if (postTitle.length > 30) throw badRequestError(inputParameter + " cannot contain more than 30 characters!")
};

const validateEmail = (inputEmail) => {
  /**
   * @param {inputEmail}
   * @throws {emailFormat}
   */
  let emailFormat =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/g;
  inputEmail = inputEmail.trim();
  if (!inputEmail) throw badRequestError("You must provide an email address!");
  if (typeof inputEmail !== "string" || typeof inputEmail === undefined)
    throw badRequestError("Email address must be a string!");
  if (!emailFormat.test(inputEmail))
    throw badRequestError("Please enter a valid email address!");
};
const validatePhoneNumber = (inputPhoneNumber) => {
  /**
   * @param {inputPhoneNumber}
   * @throws {phoneNumberFormat}
   */
  let mobileFormat = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}$/g;
  inputPhoneNumber = inputPhoneNumber.trim();
  if (!inputPhoneNumber)
    throw badRequestError("You must provide Phone Number!");
  if (
    typeof inputPhoneNumber !== "string" ||
    typeof inputPhoneNumber === undefined
  )
    throw badRequestError("Phone number must be a string!");
  if (!mobileFormat.test(inputPhoneNumber))
    throw badRequestError("Please enter a valid phone number!");
};

const validateUsername = (username) => {
  if (!username || typeof username != "string" || username.trim().length === 0)
    throw badRequestError(`Missing username!`);
  username = username.trim();
  const usernameRegex = /^[a-z0-9]{4,}$/i;
  if (!usernameRegex.test(username))
    throw badRequestError(
      `Invalid username: The username must be only alphanumeric and have atleast 4 characters!`
    );
};

const validatePassword = (password) => {
  /**
   * @param {password} string
   * For the password, it must be a valid string (no empty spaces and no spaces but can be any other character
   * including special characters) and should be at least 6 characters long. If it fails any of those conditions,
   * you will throw an error.  The constraints for password will be: There needs to be at least one uppercase
   * character, there has to be at least one number and there has to be at least one special character:
   * for example:  Not valid: test123, test123$, foobar, tS12$ Valid: Test123$, FooBar123*, HorsePull748*%
   */
  if (!password || typeof password != "string" || password.trim().length === 0)
    throw badRequestError(`Missing Password!`);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/;
  if (!passwordRegex.test(password))
    throw badRequestError(
      `Invalid password: Password must contain atleast 1 uppercase character, 1 lowercase character, 1 number, 1 special character and be atleast 8 characters long`
    );
  return true;
};

const validatePetAge = (petAge) => {
  /**
   * @param {petAge} number
   * @throws {validFormat}
   */
  petAge = parseInt(petAge);
  if (petAge > 0) throw badRequestError("Pet age cannot be less than 0!");
};

export {
  validateObjectId,
  validateName,
  validateString,
  validateEmail,
  validatePhoneNumber,
  validateUsername,
  validatePassword,
  validatePetAge,
  validatePostTitle
};
