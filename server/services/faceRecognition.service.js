import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import userService from './user.service.js';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const weightsPath = resolve(__dirname, "..", "weights");

class FaceRecognitionService {
  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromDisk(weightsPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(weightsPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(weightsPath);
  }

  getFaceDetectorOptions = () => {
    return new faceapi.TinyFaceDetectorOptions({
      inputSize: 160, 
      scoreThreshold: 0.5
    });
  };

  compareDescriptors(queryDescriptor, storedDescriptors, threshold = 0.6) {
    console.log('Comparing descriptors...');
    let bestMatchId = null;
    let minDistance = Number.MAX_VALUE;
    for (const { _id, faceDescriptor, fullName } of storedDescriptors) {
      const distance = faceapi.euclideanDistance(queryDescriptor, faceDescriptor);
      console.log(`Distance to user ${fullName}: ${distance}`);
      if (distance < threshold && distance < minDistance) {
        minDistance = distance;
        bestMatchId = _id;
      }
    }
    
    if (bestMatchId) {
      console.log(`Best match found with user ${storedDescriptors.find(user => user._id === bestMatchId).fullName}`);
      return bestMatchId;
    }

    console.log('No match found.');
    return null;
  }

  async getQueryDescriptor(queryImagePath) {
    try {
      const queryImage = await canvas.loadImage(queryImagePath);
      const detection = await faceapi.detectSingleFace(queryImage, this.getFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        console.error('No face detected in query image');
        return null;
      }
      return detection.descriptor;
    } catch (error) {
      console.error('Error processing query image:', error);
      throw error;
    }
  }

  async recognizeFace(queryImagePath) {
    const queryDescriptor = await this.getQueryDescriptor(queryImagePath);
    if (!queryDescriptor) {
      throw new Error('No face detected in query image');
    }

    const storedDescriptors = await userService.getStoredDescriptors();
    return this.compareDescriptors(queryDescriptor, storedDescriptors);
  }
}

export default new FaceRecognitionService();