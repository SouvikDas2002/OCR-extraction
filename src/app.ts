import express from "express";
import multer from 'multer';
import path from "path";
import cors from "cors";
import Tesseract from "tesseract.js";
import sharp from 'sharp'
import fs from 'fs'

const app=express();
const PORT= 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  }));
  app.use(express.json());

const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload=multer({
    storage,
    fileFilter:(req,file,cb)=>{
        const fileTypes=/jpeg|jpg|png/;
        const extname=fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType=fileTypes.test(file.mimetype);

        if(extname && mimeType){
            return cb(null,true);
        }else{
            return cb(new Error("Only images are allowed"));
        }
    }
})

app.post("/upload", upload.single("image"), async (req, res):Promise<any>=> {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  try{
    const filePath=path.join(__dirname,".././uploads",req.file.filename);
    console.log(filePath);
    const processedPath = path.join(__dirname, ".././uploads", `processed-${req.file.filename}`);

    const metadata=await sharp(filePath).metadata();
    console.log("hello "+ metadata);

    // if(metadata.width && metadata.height && metadata.width<3){
        // await sharp(filePath).resize({width:1000}).toBuffer().then(data => fs.writeFileSync(filePath, data));
    // }
    await sharp(filePath)
      .resize({ width: 1300 }) 
      .grayscale() 
      .normalize() 
      .threshold(200) 
      .toFile(processedPath);
    

    const {data:{text}}=await Tesseract.recognize(processedPath,"eng",{
      logger: (m) => console.log(m),
      // ptessedit_char_whitelist=0123456789,
      // psm:6
    });
    console.log(text.split("\n"));
    const data=text.split("\n");
    console.log(!data[3].split(" ").includes("Congratulations!"));
    
    if(data[2]!=="Best Game on Google Play"&&data[3]!=="Best Game on Google Play" && !data[3].split(" ").includes("Congratulations!")){
      res.json({ message: "Wrong image"});
      return;
    }

    const points=data.reverse();
    console.log(points[3]);
    
    
    res.json({ message: "Image uploaded successfully!", file: req.file.filename, extractedText: points[3] });
  } catch (error) {
    res.json({ message: "Image uploaded failed"});
  }
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})