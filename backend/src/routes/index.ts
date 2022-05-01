import express from 'express';
import * as mainController from '../controllers/main';
import CustomError from '../errors/custom-error';
import { SuccessResponse } from '../utils/response-handler';
const router = express.Router();

router.get('/', mainController.rootMainController);

router.get('/getAllRegions', mainController.getAllRegions);

router.get('/getAllAlgorithms', mainController.getAllAlgorithms);

router.post('/execAlgorithm', mainController.execAlgorithm);

// ? *** DEBUG START ***
router.get('/getLandmarks/:region', async (req, res) => {
  try {
    const region: string = req.params.region;
    const landmarks = Object.keys(global.landmarks[region]).map((lKey) => {
      return { id: lKey, lat: global.landmarks[region][lKey].lat, lon: global.landmarks[region][lKey].lon };
    });
    res.json(SuccessResponse({ landmarks }, 'Fetched landmarks successfully'));
  } catch (err: any) {
    console.log(err.message);
  }
});

router.post('/deleteLandmark', async (req, res) => {
  try {
    const landmarkId = req.body.id;
    const region = req.body.region;
    if (global.landmarksCount == 0) throw new CustomError('No landmarks remaining in this region', 400);
    global.landmarksCount -= 1;
    delete global.landmarks[region][landmarkId];
    res.json(SuccessResponse({}, 'Deleted landmark successfully'));
  } catch (err) {
    console.log(err);
  }
});

// ? *** DEBUG END ***

export default router;
