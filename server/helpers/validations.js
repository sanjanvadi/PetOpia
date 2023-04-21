import { ObjectId } from "mongodb";
import moment from "moment";

const validString = (userInput, inputParameter) => {
  /**
   * @param {userInput} string
   * @param {inputParameter} string
   * @throws {MissingInput}
   */
  if (!userInput) throw `Please provide ${inputParameter}!`;
  if (typeof userInput !== "string" || typeof userInput === "undefined")
    throw `${inputParameter} must be a string!`;
  if (userInput.trim().length === 0)
    throw (
      inputParameter + " cannot be an empty string or string with just spaces!"
    );
};

const validObjectId = (inputId, inputParameter) => {
  /**
   * @param {inputId} string
   * @param {inputParameter} string
   * @throws {MissingInput}
   * @throws {InvalidObjectID}
   */
  if (!inputId) throw "You must provide an " + inputParameter;
  if (typeof inputId !== "string" || typeof inputId === "undefined")
    throw inputParameter + " must be a string!";
  if (inputId.trim().length === 0)
    throw inputParameter + " cannot be an empty string or just spaces!";

  if (!ObjectId.isValid(inputId.trim()))
    throw `Invalid object ${inputParameter}!`;
};
const validName = (inputName, inputParameter) => {
  /**
   * @param {inputName} string
   * @param {inputParameter} string
   */
  if (!inputName) throw `Please provide ${inputParameter}!`;
  if (typeof inputName !== "string" || typeof inputName === "undefined")
    throw inputParameter + " must be a string!";
  if (inputName.trim().length === 0)
    throw (
      inputParameter + " cannot be an empty string or string with just spaces!"
    );
  const name = inputName.trim().split(" ");
  if (name.length > 1) {
    throw inputParameter + " should be in valid format!";
  } else {
    let format = /[`0123456789!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/;
    if (inputName.length < 2 || format.test(inputName)) {
      throw (
        inputParameter +
        " must be atleast 2 characters long and should not contain any special characters or numbers!"
      );
    }
  }
};

const validEmail = (inputEmail) => {
  /**
   * @param {inputEmail}
   * @throws {emailFormat}
   */
  let emailFormat =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/g;
  inputEmail = inputEmail.trim();
  if (!inputEmail) throw "You must provide an email address!";
  if (typeof inputEmail !== "string" || typeof inputEmail === "undefined")
    throw "Email address must be a string!";
  if (!emailFormat.test(inputEmail))
    throw "Please enter a valid email address!";
};
const validPhoneNumber = (inputPhoneNumber) => {
  /**
   * @param {inputPhoneNumber}
   * @throws {phoneNumberFormat}
   */
  let mobileFormat = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}$/g;
  inputPhoneNumber = inputPhoneNumber.trim();
  if (!inputPhoneNumber) throw "You must provide Phone Number!";
  if (
    typeof inputPhoneNumber !== "string" ||
    typeof inputPhoneNumber === "undefined"
  )
    throw "Phone number must be a string!";
  if (!mobileFormat.test(inputPhoneNumber))
    throw "Please enter a valid phone number!";
};

const validUsername = (username) => {
  if (!username || typeof username != "string" || username.trim().length === 0)
    throw `Missing username`;
  username = username.trim();
  const usernameRegex = /^[a-z0-9]{4,}$/i;
  if (!usernameRegex.test(username))
    throw `Invalid username: The username must be only alphanumeric and have atleast 4 characters`;
};

const validPassword = (password) => {
  /**
   * @param {password} string
   * For the password, it must be a valid string (no empty spaces and no spaces but can be any other character
   * including special characters) and should be at least 6 characters long. If it fails any of those conditions,
   * you will throw an error.  The constraints for password will be: There needs to be at least one uppercase
   * character, there has to be at least one number and there has to be at least one special character:
   * for example:  Not valid: test123, test123$, foobar, tS12$ Valid: Test123$, FooBar123*, HorsePull748*% 
   */
  if (!password || typeof password != "string" || password.trim().length === 0)
    throw `Missing Password`;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/;
  if (!passwordRegex.test(password))
    throw `Invalid password: Password must contain atleast 1 uppercase character, 1 lowercase character, 1 number, 1 special character and be atleast 8 characters long`;
  return true;
};

const validPetAge = (petAge) => {
  /**
   * @param {petAge} number
   * @throws {validFormat}
   */
  petAge = parseInt(petAge);
  if (petAge > 0) throw "Pet age cannot be less than 0!";
};

const validDate = (dateString) => {
  if (
    !dateString ||
    typeof dateString != "string" ||
    dateString.trim().length === 0
  )
    throw `Missing Date`;
  if (!moment(dateString, "YYYY-MM-DD", true).isValid()) throw `Invalid Date!`;
};

export {
  validObjectId,
  validName,
  validString,
  validLogin,
  validEmail,
  validPhoneNumber,
  validUsername,
  validPassword,
  validDate,
  validPetAge,
  validDate,
};
