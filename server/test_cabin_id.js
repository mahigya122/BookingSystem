import dotenv from "dotenv";
import { getCabinById } from "./services/cabinService.js";

dotenv.config({ path: "./server/.env" });

async function testGetCabinById() {
  try {
    const id = "8687641b-9e81-4555-a22a-7b263b5ddfa1";
    const cabin = await getCabinById(id);
    console.log(`Cabin ${id} data:`);
    console.log(JSON.stringify(cabin, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testGetCabinById();
