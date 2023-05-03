import { Router } from "express";
const router = Router();
import { createApp, createMed, createPet, createPres, deleteApp, deleteMed, deletePet, deletePres, getAllApp, getAllMed, getAllPets, getAllPres, updatePet } from "../data/pet.js";


router.route('/medication')
.get(async (req, res) => {
    try {
        let input = req.body;
        
        let userId = input.userId;
        let petId = input.petId

        let data = await getAllMed(userId, petId);
        res.status(200).send(data);
    } catch(e) {
        res.status(404).send(e);
    }
    
})
.post(async (req, res) => {
    try {
        let input = req.body;
        let userId = input.userId;
        let petId = input.petId
        let medicationName = input.medicationName;
        let administeredDate = input.administeredDate;
        let dosage = input.dosage;

        let data = await createMed(userId, petId, medicationName, administeredDate, dosage);
        res.status(200).send(data);
    } catch(e) {
        res.status(404).send(e);
    }
})
.delete(async (req, res) => {
    try {
        let input = req.body;
        let userId = input.userId;
        let petId = input.petId
        let medId = input.medId;

        let data = await deleteMed(userId, petId, medId);
        res.status(200).send(data);
    } catch(e) {
        res.status(404).send(e);
    }
})


router.route('/appointment')
.get(async (req, res) => {
    try {
        let input = req.body;
        let userId = input.userId;
        let petId = input.petId

        let data = await getAllApp(userId, petId);
        res.status(200).send(data);
    } catch(e) {
        res.status(404).send(e);
    }
})
.post(async (req, res) => {
    try {
        let input = req.body;
        let userId = input.userId;
        let petId = input.petId
        let appointmentDate = input.appointmentDate;
        let reason = input.reason;
        let clinicName = input.clinicName;

        let data = await createApp(userId, petId, appointmentDate, reason, clinicName);
        res.status(200).send(data);
    } catch(e) {
        res.status(404).send(e);
    }
})
.delete(async (req, res) => {
    try {
        let input = req.body;
        let userId = input.userId;
        let petId = input.petId
        let appId = input.appId;

        let data = await deleteApp(userId, petId, appId);
        res.status(200).send(data);
    } catch(e) {
        res.status(404).send(e);
    }
})

router.route('/prescription')
.get(async (req, res) => {
    let input = req.body;
    let userId = input.userId;
    let petId = input.petId

    let data = await getAllPres(userId, petId);
    res.status(200).send(data);
})
.post(async (req, res) => {
    // req.on('data', data => {
    //     console.log(data.toString('base64'));
    // });
    
    let input = req.body;
    let userId = input.userId;
    let petId = input.petId
    let imageUrl = input.imageUrl;
    console.log(imageUrl);
    let data = await createPres(userId, petId, imageUrl);
    res.status(200).send(data);
})
.delete(async (req, res) => {
    let input = req.body;
    let userId = input.userId;
    let petId = input.petId
    let imageUrl = input.imageUrl

    let data = await deletePres(userId, petId, imageUrl);
    res.status(200).send(data);
})

router.route('/:userid')
.get(async (req, res) => {
    let userId = req.params.userid
    let data = await getAllPets(userId);
    res.status(200).send(data);
})
.post(async (req, res) => {
    let userId = req.params.userid

    let input = req.body;
    let petName = input.petName;
    let petAge = input.petAge;
    let petType = input.petType;
    let petBreed = input.petBreed;

    let data = await createPet(userId, petName, petAge, petType, petBreed);
    res.status(200).send(data);
})
.put(async (req, res) => {
    let input = req.body;
    let userId = req.params.userid
    let petId = input.petId
    let petName = input.petName;
    let petAge = input.petAge;
    let petType = input.petType;
    let petBreed = input.petBreed;

    let data = await updatePet(userId, petId, petName, petAge, petType, petBreed);
    res.status(200).send(data);
})
.delete(async (req, res) => {
    let input = req.body;
    let userId = req.params.userid
    let petId = input.petId

    let data = await deletePet(userId, petId);
    res.status(200).send(data);
})

export default router