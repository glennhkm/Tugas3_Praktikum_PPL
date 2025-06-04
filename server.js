import express from "express";
import jerseyRoutes from "./routes/jerseyRoutes.js";
import pemesananRoutes from "./routes/pemesananRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/jerseys", jerseyRoutes);
app.use("/pemesanan", pemesananRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
