const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");


const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MULTER CONFIG
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// =======================
// RESUME UPLOAD ROUTE
// =======================
app.post("/api/resume/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("Uploaded file:", req.file);

  res.json({
    message: "Resume uploaded successfully",
    filePath: req.file.path, // IMPORTANT
  });
});

// =======================
// RESUME READ (PDF → TEXT)
// =======================

app.post("/api/resume/read", async (req, res) => {
  try {
    const { filePath } = req.body;

    const absolutePath = path.resolve(__dirname, filePath);
    console.log("Reading file:", absolutePath);

    const buffer = fs.readFileSync(absolutePath);
    const data = await pdfParse(buffer);

    res.json({
      success: true,
      text: data.text
    });
  } catch (err) {
    console.error("PDF ERROR 👉", err);
    res.status(500).json({ error: "Failed to read resume" });
  }
});


// =======================
// SERVER START
// =======================
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
