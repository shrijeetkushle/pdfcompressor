const express = require("express");

const multer = require("multer");

const path = require("path");

const { exec } = require("child_process");

const fs = require("fs");

const app = express();

const upload = multer({ dest: "uploads/" });



app.use(express.static("public"));

app.post("/upload", upload.single("pdfFile"), (req, res) => {

  const inputPath = req.file.path;

  const outputPath = `uploads/compressed_${req.file.originalname}`;



  // Ghostscript command for compression

  const command = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

  

  exec(command, (error, stdout, stderr) => {

    if (error) {

      console.error(`Error: ${error.message}`);

      console.error(`stderr: ${stderr}`);

      res.status(500).send("Compression failed.");

      return;

    }

    

    console.log(`stdout: ${stdout}`);

    // Send the compressed file URL as a response

    res.json({ fileUrl: `/${outputPath}` });



    setTimeout(() => {

      fs.unlink(inputPath, () => {});

      fs.unlink(outputPath, () => {});

    }, 60000);

  });

});



app.use(express.static(path.join(__dirname, "uploads")));



const PORT = 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port http://localhost:${PORT}`);

});


