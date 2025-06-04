import readline from "readline";
import fs from "fs";

// Constants
const BASE_URL = "http://localhost:3000";
const JERSEY_DB_PATH = "./database/jersey_master.json";
const ORDER_DB_PATH = "./database/pemesanan.json";

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(amount);
};

const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return { data: [] };
  }
};

const promptUser = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const displayJerseyTable = (jerseys) => {
  console.log("\nErspo Daftar Jersey");
  console.table(
    jerseys.map((jersey) => ({
      id: jersey.id,
      Nama: jersey.Nama,
      Harga: formatCurrency(jersey.Harga),
      Stok: jersey.Stok,
      "Kit Type": jersey["Kit Type"],
      Grade: jersey.Grade
    }))
  );
};

const displayOrderTable = (orders) => {
  console.log("\nErspo Daftar Order");
  console.table(
    orders.map((order) => ({
      id: order.id,
      id_jersey: order.jersey_id,
      Kuantitas: order.Kuantitas,
      "Total Harga": formatCurrency(order["Total Harga"])
    }))
  );
};

// Main functions
const showJerseys = async () => {
  const { data: jerseys } = await fetchData("jerseys");
  displayJerseyTable(jerseys);
  menu();
};

const orderJersey = async () => {
  try {
    console.log("\nOrder Jersey");
    console.log("=".repeat(12));
    
    // Kit Type selection
    console.log("\nSilahkan pilih Kit Type");
    console.log("1. Home");
    console.log("2. Away");
    
    const kitAnswer = await promptUser("\nPilih Kit Type: ");
    let kitType;
    
    switch (kitAnswer) {
      case "1":
        kitType = "Home";
        break;
      case "2":
        kitType = "Away";
        break;
      default:
        console.log("\nMenu tidak tersedia");
        return menu();
    }
    
    // Grade selection
    console.log("\nSilahkan pilih Grade");
    console.log("1. Player Issue");
    console.log("2. Replica");
    console.log("3. Fans");
    
    const gradeAnswer = await promptUser("\nPilih Grade: ");
    let grade;
    
    switch (gradeAnswer) {
      case "1":
        grade = "Player Issue";
        break;
      case "2":
        grade = "Replica";
        break;
      case "3":
        grade = "Fans";
        break;
      default:
        console.log("\nMenu tidak tersedia");
        return menu();
    }
    
    // Fetch filtered jerseys
    const { data: jerseys } = await fetchData(`jerseys?grade=${grade}&kitType=${kitType}`);
    
    if (jerseys.length === 0) {
      console.log("Tidak ada jersey tersedia untuk pilihan tersebut.");
      return menu();
    }
    
    displayJerseyTable(jerseys);
    
    // Select jersey and quantity
    const jerseyId = await promptUser("\nPilih Id Jersey: ");
    const selectedJersey = jerseys.find(jersey => jersey.id === +jerseyId);
    
    if (!selectedJersey) {
      console.log("\nJersey tidak ditemukan");
      return orderJersey();
    }
    
    const quantity = await promptUser("Jumlah: ");
    
    if (selectedJersey.Stok < +quantity) {
      console.log("\nStok tidak cukup");
      return orderJersey();
    }
    
    // Create order
    const orderData = {
      id: new Date().getTime(),
      jersey_id: selectedJersey.id,
      Kuantitas: +quantity,
      "Total Harga": selectedJersey.Harga * +quantity
    };
    
    const result = await fetchData("pemesanan", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
    
    console.log("\nOrder berhasil!");
    menu();
  } catch (error) {
    console.error("Error in orderJersey:", error);
    menu();
  }
};

const showOrders = async () => {
  const { data: orders } = await fetchData("pemesanan");
  
  if (orders.length === 0) {
    console.log("\nBelum ada order");
    return menu();
  }
  
  displayOrderTable(orders);
  menu();
};

const editOrder = async () => {
  try {
    const { data: orders } = await fetchData("pemesanan");
    
    if (orders.length === 0) {
      console.log("\nBelum ada order");
      return menu();
    }
    
    displayOrderTable(orders);
    
    const orderId = await promptUser("\nPilih Id Order: ");
    const selectedOrder = orders.find(order => order.id === +orderId);
    
    if (!selectedOrder) {
      console.log("\nOrder tidak ditemukan");
      return editOrder();
    }
    
    const quantity = await promptUser("Jumlah Kuantitas: ");
    
    // Load jerseys from file to check stock
    const allJerseys = JSON.parse(fs.readFileSync(JERSEY_DB_PATH, "utf8"));
    const selectedJersey = allJerseys.find(jersey => jersey.id === selectedOrder.jersey_id);
    
    if (selectedJersey.Stok + selectedOrder.Kuantitas < +quantity) {
      console.log("\nStok tidak cukup");
      return editOrder();
    }
    
    // Update order
    const updatedOrder = {
      ...selectedOrder,
      Kuantitas: +quantity,
      "Total Harga": selectedJersey.Harga * +quantity
    };
    
    const result = await fetchData(`pemesanan/${selectedOrder.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedOrder)
    });
    
    console.log(`\n${result.message || "Order berhasil diubah!"}`);
    menu();
  } catch (error) {
    console.error("Error in editOrder:", error);
    menu();
  }
};

const deleteOrder = async () => {
  try {
    // For delete, we'll use local file operations as in the original code
    const orders = JSON.parse(fs.readFileSync(ORDER_DB_PATH, "utf8"));
    
    if (orders.length === 0) {
      console.log("\nBelum ada order");
      return menu();
    }
    
    displayOrderTable(orders);
    
    const orderId = await promptUser("\nPilih Id Order: ");
    const selectedOrder = orders.find(order => order.id === +orderId);
    
    if (!selectedOrder) {
      console.log("\nOrder tidak ditemukan");
      return deleteOrder();
    }
    
    // Update jersey stock
    const allJerseys = JSON.parse(fs.readFileSync(JERSEY_DB_PATH, "utf8"));
    const updatedJerseys = allJerseys.map(jersey => {
      if (jersey.id === selectedOrder.jersey_id) {
        return {
          ...jersey,
          Stok: jersey.Stok + selectedOrder.Kuantitas
        };
      }
      return jersey;
    });
    
    // Save updated jerseys
    fs.writeFileSync(JERSEY_DB_PATH, JSON.stringify(updatedJerseys, null, 2));
    
    // Remove order
    const newOrders = orders.filter(order => order.id !== +orderId);
    fs.writeFileSync(ORDER_DB_PATH, JSON.stringify(newOrders, null, 2));
    
    console.log("\nOrder berhasil dihapus!");
    menu();
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    menu();
  }
};

const menu = async () => {
  console.log("\nMenu:");
  console.log("1. Tampilkan Daftar Jersey");
  console.log("2. Order Jersey");
  console.log("3. Tampilkan Daftar Order");
  console.log("4. Edit Daftar Order");
  console.log("5. Hapus Order");
  console.log("6. Keluar");

  const choice = await promptUser("\nPilih Menu: ");
  
  switch (choice) {
    case "1":
      await showJerseys();
      break;
    case "2":
      await orderJersey();
      break;
    case "3":
      await showOrders();
      break;
    case "4":
      await editOrder();
      break;
    case "5":
      await deleteOrder();
      break;
    case "6":
      console.log("Terima kasih telah menggunakan Erspo Jersey Store!");
      rl.close();
      break;
    default:
      console.log("Menu tidak tersedia");
      menu();
      break;
  }
};

// Start the application
console.log("\nSelamat Datang di Erspo Jersey Store");
console.log("=".repeat(35));
menu();