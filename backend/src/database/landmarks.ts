import mongoose from 'mongoose';
import { LandMarks } from '../utils/interfaces/graph';

const LandMarkModel = mongoose.model('Landmark', new mongoose.Schema({}), 'landmarks');

export const uploadLandmarks = async (landmarks: LandMarks) => {
  try {
    console.log(Object.keys(landmarks).length);
    const newLandmarks = new LandMarkModel({ landmarks });
    await newLandmarks.save();
    console.log('Saved all landmarks');
  } catch (err) {
    console.log(err);
  }
};

export const fetchLandmarks = () => {};
