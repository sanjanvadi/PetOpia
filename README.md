# PetOpia - A Pet Health Management Platform

#### Description:

PetOpia is a Pet Health Management Platform that aims to help users to manage their pets’ health and well-
being by tracking their essential needs like vaccination, medication, medical check-ups, etc. Users can set
reminders for pets medication, or doctor’s appointments. Other features include pet adoption resources.

Pet owners will have a community to share queries about their pets and get tips and suggestions from other
users via the comment section. Users will also be able to upvote any comment. The most upvoted comment
will be featured at the top of the comment section.

#### Setup and Installation:
##### Locally:

Step 1: Clone this repository. => cd client ; Run `npm install --force` in the `client` folder
and in a new termainal => cd server ; Run  `npm install` in the `server` folder

Step 2: create a .env in the server folder file exists and contains the fields DATABASE_URL and DATABASE_NAME copy paste the secrets from the env text file provide along with the zip file into the .env

Step 3: Run `redis-server` to start a Redis server

Step 4: Run `npm start` from the server directory and the client directory to start the server for the backend and the frontend respectively

Step 5: Navigate to the route [http://localhost:3000]() (default) or whatever URL is used by the client (React) to start the server to get started with using PetOpia

##### On AWS:
Visit http://3.140.124.8/ to use the site!

#### Validation Used
Pet Center Page =>
Add Pet Form and Edit Pet Form: 
  Name : cannot be empty, cannot be just space characters
  Type : cannot be empty, cannot be just space characters
  Breed : cannot be empty, cannot be just space characters
  Age : cannot be empty, cannot be just space characters, must be a number, cannot be 0
  
Add Medication=>
  Name : cannot be empty, cannot be just space characters
  Date : must be date, within today to max 1 year from present date
  Dosage : cannot be empty, cannot be just space characters

Add Appointment=>
  Reason : cannot be empty, cannot be just space characters
  Date : must be date, within today to max 1 year from present date
  clinic name : cannot be empty, cannot be just space characters
Community Page=>
Add Post and Edit Post=>
  Title: cannot be empty, cannot be just space characters, must be less than 30 characters
  Description : cannot be empty, cannot be just space characters
  
Add Comment=> cannot be empty, cannot be just space characters
