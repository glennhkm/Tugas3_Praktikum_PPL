import fs from "fs";

const Jerseys = JSON.parse(
    fs.readFileSync("./database/jersey_master.json", "utf8")
);

export default Jerseys;