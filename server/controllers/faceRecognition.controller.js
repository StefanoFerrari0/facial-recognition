import userService from "../services/user.service.js";
import faceRecognitionService from "../services/faceRecognition.service.js";
import fs from 'node:fs/promises'
class FaceRecognitionController {
  async recognizeFace(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "No file has been uploaded." });
      }
      const queryImagePath = req.file.path; // Ruta de la imagen subida
      const userId = await faceRecognitionService.recognizeFace(queryImagePath);

      // Responde al cliente con el ID del usuario o un mensaje de no coincidencia
      if (userId) {
        const userData = await userService.getUserById(userId);
        res.status(200).json(userData);
      } else {
        res.status(404).json({ message: "No match found" });
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
      res.status(500).json({ message: error.message });
    } finally {
      // Elimina la imagen subida después de procesar
      fs.unlink(req?.file?.path, (err) => {
        if (err) {
          console.error("Failed to delete query image:", err);
        }
      });
    }
  }
}

export default new FaceRecognitionController();