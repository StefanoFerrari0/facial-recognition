import bcrypt from "bcryptjs";
import { VITE_SECRET_KEY } from "../config/index.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";

export const generateDefaultPassword = (firstName, lastName, dni) => {
  const dniLastThreeDigits = dni.slice(-3);
  const firstNameFirstTwoDigits = firstName.slice(0, 2);
  const lastNameFirstTwoDigits = lastName.slice(0, 2);
  return `${firstNameFirstTwoDigits}${lastNameFirstTwoDigits}${dniLastThreeDigits}`;
};

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (rawPassword, encryptedPassword) => {
  return await bcrypt.compare(rawPassword, encryptedPassword);
};

export const generateJwt = (user) => {
  jwt.sign({ id: user._id, role: user.role }, VITE_SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const verifyJwt = (token) => {
  return jwt.verify(token, VITE_SECRET_KEY);
};

export const createUpload = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  return multer({ storage });
}