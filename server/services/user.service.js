import User from "../models/user.model.js";
import { Roles } from "../utils/constants.js";
import { encryptPassword } from "../utils/functions.js";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join, parse } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const facesDir = resolve(__dirname, "..", "faces");
class UserService {
  async createUser(userData) {
    const user = new User(userData);
    user.password = await encryptPassword(userData.dni);
    await user.save();
    return user;
  }

  async getUserById(id) {
    return await User.findById(id).select("-password");
  }

  async getUserByEmail(email) {
    return await User.findOne({email})
  }

  async getUsersByRole(role) {
    return await User.find({ role }).select("-password");
  }

  async getUsersByRoles(roles) {
    return await User.find({ role: { $in: roles } }).select("-password");
  }

  async getAllUsers() {
    return await User.find({}).select("-password");
  }

  async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData, {
      new: true,
    }).exec();
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId).exec();
  }

  async getStoredFaceImagesFromFacesFolder() {
    const files = fs.readdirSync(facesDir);
    const storedImages = files.map(file => {
      const filePath = join(facesDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = parse(file).name;

      return {
        _id: fileName,
        faceImage: fileBuffer,
        fullName: fileName,
      };
    });
    return storedImages;
  }

  async getStoredDescriptors(){
    const desiredRoles = [Roles.EMPLOYEE, Roles.SECRETARY];
    const users = await User.find({ role: { $in: desiredRoles } }, { _id: 1, faceDescriptor: 1, firstName: 1, lastName: 1 }).lean();
    return users.map(user => {
      const descriptorArray = new Float32Array(user.faceDescriptor);
      return {
        _id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        faceDescriptor: descriptorArray
      };
    });
  }
}

export default new UserService();