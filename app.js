const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ success: true, message: "Real Estate CRM API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api", require("./routes/buildingRoutes"));
app.use("/api", require("./routes/unitRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/users", require("./routes/employeeRoutes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorMiddleware);

module.exports = app;