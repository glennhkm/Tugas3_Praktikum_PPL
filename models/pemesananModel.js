import fs from "fs";

export const Pemesanan = JSON.parse(
    fs.readFileSync("./database/pemesanan.json", "utf8")
);

export default Pemesanan;