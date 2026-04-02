import multer from 'multer';
import path from 'path';
import os from 'os';

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save to local uploads folder
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images and PDFs only!');
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
