const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// uploads folder
const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🔥 ROOT ROUTE (THIS FIXES 403)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// 🔥 RESUME UPLOAD ROUTE
app.post("/api/resume/upload", upload.single("resume"), (req, res) => {
  console.log("FILE RECEIVED:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file received" });
  }

  res.json({
    message: "Resume uploaded successfully",
    file: req.file.filename,
  });
});

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
