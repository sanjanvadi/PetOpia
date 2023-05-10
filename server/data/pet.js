import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import emailSender from "./reminderEmail.js";
import redis from "redis";
const client = redis.createClient();
client.connect();

const getAllPets = async (userId) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });
  if(!user){
    throw "User Not Found!"
  }
  let data = user.pets;
  await client.set(userId, JSON.stringify(data));
  return data;
};

const getPet = async (userId, petId) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let data = user.pets;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["_id"].toString() === petId) {
      data[i]["_id"] = data[i]["_id"].toString();
      return data[i];
    }
  }
  throw "Pet Not Found!";
};

const createPet = async (
  userId,
  petImage,
  petName,
  petAge,
  petType,
  petBreed
) => {
  const collection = await users();
  let newPet = {
    _id: new ObjectId(),
    petImage,
    petName,
    petAge,
    petType,
    petBreed,
    medications: [],
    appointments: [],
    prescription: [],
  };

  let insert = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { pets: newPet } }
  );
  if (insert.insertedCount === 0)
    throw "Internal server error. Try again later...";
  return getAllPets(userId);
};

const updatePet = async (userId, petId, petName, petAge, petType, petBreed) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = {};
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      if (petName) res[i]["petName"] = petName;
      if (petAge) res[i]["petAge"] = petAge;
      if (petType) res[i]["petType"] = petType;
      if (petBreed) res[i]["petBreed"] = petBreed;

      updatedData = res[i];
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "You haven't made any changes!";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

const deletePet = async (userId, petId) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let data = user.pets;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["_id"].toString() === petId) {
      let del = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { pets: data[i] } }
      );
      if (del.modifiedCount === 0) throw "Could not delete review successfully";
    }
  }

  return await getAllPets(userId);
};

// const getAllMed = async (userId, petId) => {
//     const collection = await users();
//     const user = await collection.findOne(
//         {_id: new ObjectId(userId)}
//     )

//     let res = user.pets;
//     for(let i = 0; i < res.length; i++) {
//         if(res[i]['_id'].toString() === petId) {
//             return res[i].medications;
//         }
//     }
//     return "It seems like your pet is perfectly alright. No medications found";
// }

const createMed = async (
  userId,
  petId,
  medicationName,
  administeredDate,
  dosage
) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = {};
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      let obj = {
        _id: new ObjectId(),
        medicationName,
        administeredDate,
        dosage,
      };
      res[i].medications.push(obj);
      updatedData = res[i];
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "Internal server error. Try again later...";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

const deleteMed = async (userId, petId, medId) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = [];
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      let med = res[i].medications;
      for (let j = 0; j < med.length; j++) {
        if (med[j]["_id"].toString() === medId) {
          med.splice(j, 1);
          updatedData = res[i];
        }
      }
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "Internal server error. Try again later...";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

// const getAllApp = async (userId, petId) => {
//     const collection = await users();
//     const user = await collection.findOne(
//         {_id: new ObjectId(userId)}
//     )

//     let res = user.pets;
//     for(let i = 0; i < res.length; i++) {
//         if(res[i]['_id'].toString() === petId) {
//             return res[i].appointments;
//         }
//     }
//     return "An apple a day keeps the docter away. Sorry, dog food a day keeps the docter away. No upcoming appointments";
// }

const createApp = async (
  userId,
  petId,
  appointmentDate,
  reason,
  clinicName
) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = {};
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      let obj = {
        _id: new ObjectId(),
        appointmentDate,
        reason,
        clinicName,
      };
      res[i].appointments.push(obj);
      updatedData = res[i];
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "Internal server error. Try again later...";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

const deleteApp = async (userId, petId, appId) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = {};
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      let app = res[i].appointments;
      for (let j = 0; j < app.length; j++) {
        if (app[j]["_id"].toString() === appId) {
          app.splice(j, 1);
          updatedData = res[i];
        }
      }
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "Internal server error. Try again later...";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

// const getAllPres = async (userId, petId) => {
//     const collection = await users();
//     const user = await collection.findOne(
//         {_id: new ObjectId(userId)}
//     )

//     let res = user.pets;
//     for(let i = 0; i < res.length; i++) {
//         if(res[i]['_id'].toString() === petId) {
//             return res[i].prescription;
//         }
//     }
//     return "Relax your pet is doing just fine. No prescription found"
// }

const createPres = async (userId, petId, imageUrl) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = {};
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      res[i].prescription.push(imageUrl);
      updatedData = res[i];
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "Internal server error. Try again later...";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

const deletePres = async (userId, petId, imageUrl) => {
  const collection = await users();
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  let res = user.pets;
  let updatedData = {};
  for (let i = 0; i < res.length; i++) {
    if (res[i]["_id"].toString() === petId) {
      let pres = res[i].prescription;
      for (let j = 0; j < pres.length; j++) {
        if (pres[j] === imageUrl) {
          pres.splice(j, 1);
          updatedData = res[i];
        }
      }
    }
  }

  let update = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { pets: res } }
  );
  if (update.modifiedCount === 0)
    throw "Internal server error. Try again later...";

  await client.set(userId, JSON.stringify(res));

  return updatedData;
};

const medicationReminder = async () => {
  const userCollection = await users();
  const allUsers = await userCollection.find({}).toArray();
  allUsers.map((user) => {
    for (const pet of user.pets) {
      for (const medication of pet.medications) {
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + 1);
        const convertedDate = reminderDate.toISOString().split("T")[0];

        if (medication.administeredDate === convertedDate) {
          emailSender(
            user.email.toString(),
            "Medication",
            pet.petName.toString(),
            `You have your pet ${pet.petName}'s medication tomorrow!`
          );
        }
      }
    }
  });
};

const appointmentReminder = async () => {
  const userCollection = await users();
  const allUsers = await userCollection.find({}).toArray();
  allUsers.map((user) => {
    for (const pet of user.pets) {
      for (const appointment of pet.appointments) {
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + 1);
        const convertedDate = reminderDate.toISOString().split("T")[0];

        if (appointment.appointmentDate === convertedDate) {
          emailSender(
            user.email.toString(),
            "Appointment",
            pet.petName.toString(),
            `You have your pet ${pet.petName}'s appointment tomorrow!`
          );
        }
      }
    }
  });
};

export {
  getAllPets,
  createPet,
  getPet,
  updatePet,
  deletePet,
  createMed,
  deleteMed,
  createApp,
  deleteApp,
  createPres,
  deletePres,
  medicationReminder,
  appointmentReminder,
};
