import Pemesanan from "../models/pemesananModel.js";
import Jerseys from "../models/jerseysModel.js";
import response from "../helpers/response.js";
import fs from "fs";

const getPemesananList = (req, res) => {
  try {
    response.sendSuccess(res, {
      status: "SUCCESS",
      data: Pemesanan,
    });
  } catch (error) {
    response.sendError(res, {
      status: "ERROR",
      message: error.message,
    });
  }
};

const getPemesananById = (req, res) => {
  const idPemesanan = Number(req.params.id);

  const pemesanan = Pemesanan.find((pemesanan) => pemesanan.id === idPemesanan);

  try {
    response.sendSuccess(res, {
      status: "SUCCESS",
      data: pemesanan,
    });
  } catch (error) {
    response.sendError(res, {
      status: "ERROR",
      message: error.message,
    });
  }
};

const addPemesanan = async (req, res) => {
  const newPemesanan = await req.body;
  console.log(newPemesanan);
  
  try {
    const allJerseys = JSON.parse(
      fs.readFileSync("./database/jersey_master.json", "utf8")
    );
    const selectedJersey = allJerseys.find(
      (jersey) => jersey.id === newPemesanan.jersey_id
    );
    const qty = newPemesanan["Kuantitas"];
    Pemesanan.push(newPemesanan);
    fs.writeFileSync(
      "./database/pemesanan.json",
      JSON.stringify(Pemesanan, null, 2)
    );
    fs.writeFileSync(
      "./database/jersey_master.json",
      JSON.stringify(
        allJerseys.map((jersey) => {
          if (jersey.id === selectedJersey.id) {
            jersey.Stok -= +qty;
          }
          return jersey;
        }),
        null,
        2
      )
    );
    response.sendSuccessCreated(res, {
      message: "Pemesanan berhasil ditambahkan",
      data: newPemesanan,
    });
  } catch (error) {
    response.sendError(res, {
      message: error.message,
    });
  }
};

const updatePemesanan = (req, res) => {
  const pemesananUpdated = req.body
  const pemesananId = Number(req.params.id)
  const lastKuantitas = Pemesanan.find(
    (pemesanan) => pemesanan.id === pemesananId
  ).Kuantitas;

  const perubahanKuantitas = pemesananUpdated.Kuantitas - lastKuantitas;
  try {
    const newAllPemesanan = Pemesanan.map((pemesanan) => {
      if (pemesanan.id === pemesananId) {
        return pemesananUpdated;
      }
      return pemesanan;
    });
    fs.writeFileSync(
      "./database/pemesanan.json",
      JSON.stringify(newAllPemesanan, null, 2)
    );
    fs.writeFileSync(
      "./database/jersey_master.json",
      JSON.stringify(
        Jerseys.map((jersey) => {
          if (jersey.id === pemesananUpdated.jersey_id) {
            jersey.Stok += perubahanKuantitas * -1;
          }
          return jersey;
        }),
        null,
        2
      )
    );
    response.sendSuccess(res, {
      message: "Order berhasil diperbarui",
      data: pemesananUpdated,
    });
  } catch (error) {
    response.sendError(res, {
      message: error.message,
    });
  }
}


export default {
  getPemesananList,
  addPemesanan,
  getPemesananById,
  updatePemesanan,
};
