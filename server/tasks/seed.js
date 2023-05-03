import { dbConnection, closeConnection } from "../config/mongoConnection.js"
import { createMed, createPet, deleteMed, deletePet, getAllPets, updatePet } from "../data/pet.js";

const main = async () => {
    const db = await dbConnection();
    // db.dropDatabase();

    // try {
    //     let res = await getAllPets();
    //     console.log(res);
    // } catch(e) {
    //     console.log(e)
    // }
    
    // try {
    //     let res = await createPet("643f4f7caade2d644d0f8057", "Harsh", "5", "Punjabi", "Singhania");
    //     console.log(res);
    // } catch(e) {
    //     console.log(e)
    // }

    // try {
    //     let res = await updatePet("643f4f7caade2d644d0f8057", "643f6a7af1289d943bf320ac", "Shrutik", "3", "Marathi", "Yoo");
    //     console.log(res);
    // } catch(e) {
    //     console.log("Error")
    // }

    // try {
    //     let res = await deletePet("643f4f7caade2d644d0f8057", "643f6a7af1289d943bf320ac");
    //     console.log(res);
    // } catch(e) {
    //     console.log("Error")
    // }

    
    // try {
    //     let res = await createMed("643f4f7caade2d644d0f8057", "643f6a7af1289d943bf320ac", "Dolo", "3/12/2023", "2 per day");
    //     console.log(res);
    // } catch(e) {
    //     console.log(e)
    // }

    // try {
    //     let res = await deleteMed("643f4f7caade2d644d0f8057", "643f6a7af1289d943bf320ac", "6440c07651b712aabcb65201");
    //     console.log(res);
    // } catch(e) {
    //     console.log("Error")
    // }

    // closeConnection();

}

main();