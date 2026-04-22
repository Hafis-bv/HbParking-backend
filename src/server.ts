import express from "express";
import { authRouter } from "./routes/auth.route";
import { zoneRouter } from "./routes/zone.route";
import { errorMiddleware } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";
import { sessionRouter } from "./routes/session.route";
import { checkoutRouter } from "./routes/checkout.route";
import { plateRouter } from "./routes/plateNumber.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", express.json(), authRouter);
app.use("/api/zones", express.json(), zoneRouter);
app.use("/api/plates", express.json(), plateRouter);
app.use("/api/sessions", express.json(), sessionRouter);
app.use("/api/checkout", checkoutRouter);

app.get("/api", (req, res) => {
  return res.json({ msg: "Hello world from Parking API 🚀" });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server has started http://localhost:${PORT}`);
});

//stripe listen --forward-to http://localhost:8000/api/checkout/webhook
