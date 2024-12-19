import express from 'express';
import { addfood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique file name
  }
});

const upload = multer({ storage: storage });

const foodRouter = express.Router();

// Endpoint to add a food item (with image)
foodRouter.post('/add', upload.single('image'), addfood);

// Endpoint to list all food items
foodRouter.get('/list', listFood);

// Endpoint to remove a food item
foodRouter.post('/remove', removeFood);

export default foodRouter;
