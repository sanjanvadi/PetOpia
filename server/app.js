import express from "express";
import configRoutes from "../server/routes/index.js";
import { appointmentReminder, medicationReminder } from "./data/pet.js";
import cron from "node-cron";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

cron.schedule('0 8 * * *', () => {
  medicationReminder();
  appointmentReminder();
})

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});
