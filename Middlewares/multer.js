import multer from "multer";

// Configure storage
const storage = multer.diskStorage({});

// Initialize multer
const upload = multer({storage,});

export default upload;
