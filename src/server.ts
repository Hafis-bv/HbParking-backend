import express from "express";
import { authRouter } from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api", (req, res) => {
  return res.json({ msg: "Hello world from Parking API 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server has started http://localhost:${PORT}`);
});
