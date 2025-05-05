const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./Routes/authRouter");
const userRoutes = require("./Routes/userRoutes");
const patientHistoryRoutes = require("./Routes/patientHistoryRoutes");
const hospitalRoutes = require("./Routes/hospitalRoutes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers);
  next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/patient-history", patientHistoryRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_USER);
    console.log("Connected to User MongoDB");
    await mongoose.connect(process.env.MONGO_URI_USER);

    const hospitalConnection = mongoose.createConnection(
      process.env.MONGO_URI_HOSPITAL
    );
    hospitalConnection.on("connected", () => {
      console.log("Connected to Hospital MongoDB");
    });
    hospitalConnection.on("error", (err) => {
      console.error("Hospital DB connection error:", err);
    });

    // Start server only after successful MongoDB connection
    const PORT = process.env.PORT || 3001;

    // Try to start server with fallback ports
    const startServer = (port) => {
      const server = app
        .listen(port)
        .on("error", (err) => {
          if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            server.close();
            startServer(port + 1);
          } else {
            console.error("Server error:", err);
          }
        })
        .on("listening", () => {
          console.log(`Server running on port ${port}`);
        });
    };

    startServer(PORT);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// MongoDB connection event handlers
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

// Process error handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start the application
connectDB();

// Graceful shutdown
const shutdown = () => {
  console.log("\nGracefully shutting down...");
  server.close(() => {
    console.log("HTTP server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown); // Ctrl+C in terminal
process.on("SIGTERM", shutdown); // kill command or platform shutdown
