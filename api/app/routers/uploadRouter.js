import {Router} from 'express';
import uploadController from '../controllers/uploadController.js';
import { controllerWrapper as cw} from './controllerWrapper.js';

export const router = Router();

router.post('/upload', cw(uploadController.uploadPicture));
router.post('/uploadVisit', cw(uploadController.uploadPictureVisit));