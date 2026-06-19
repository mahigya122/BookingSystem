import dotenv from "dotenv";
import { getAllCabins } from "./services/cabinService.js";

dotenv.config({ path: "./server/.env" });

async function testGetAllCabins() {
  try {
    const cabins = await getAllCabins();
    console.log("First cabin data:");
    console.log(JSON.stringify(cabins[0], null, 2));
  } catch (err) {
    console.error(err);
  }
}

testGetAllCabins();
