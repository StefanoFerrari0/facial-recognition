import userService from "../services/user.service.js";
import faceRecognitionService from "../services/faceRecognition.service.js";
import dailyAttendanceService from "../services/dailyAttendance.service.js";
import { Roles, Status } from "../utils/constants.js";
import { comparePassword, generateJwt } from "../utils/functions.js";
import fs from 'node:fs/promises'
class UserController {
  async createUser(req, res) {
    try {
      const formData = JSON.parse(req.body.data);
      const { role } = formData;
      if(role === Roles.SECRETARY || role === Roles.EMPLOYEE){
        if(!req.file){
          return res.status(400).send({ message: "No file has been uploaded." });
        }
        const queryImagePath = req.file.path;
        const faceDescriptor = await faceRecognitionService.getQueryDescriptor(queryImagePath);
        if (!faceDescriptor) {
          return res.status(400).send({ message: "No face detected in query image." });
        }
        formData.faceDescriptor = Array.from(faceDescriptor);
      }

      let newUser = await userService.createUser(formData);
      const today = new Date(); 
      const existingDailyAttendance = await dailyAttendanceService.getByDate(today);
      if (!existingDailyAttendance?.attendanceRecords?.some(user => user.userId.equals(newUser._id))) {
        existingDailyAttendance.attendanceRecords.push({ userId: newUser._id, status: Status.ABSENT });
      }

      await dailyAttendanceService.update(existingDailyAttendance._id, existingDailyAttendance);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      if(req?.file){
        fs.unlink(req?.file?.path, (err) => {
          if (err) {
            console.error("Failed to delete query image:", err);
          }
        });
      }
    }
  }

  async createUserPublic(req, res) {
    try {
      const formData = JSON.parse(req.body.data);
      
        if(!req.file){
          return res.status(400).send({ message: "No file has been uploaded." });
        }
        const queryImagePath = req.file.path;
        const faceDescriptor = await faceRecognitionService.getQueryDescriptor(queryImagePath);
        if (!faceDescriptor) {
          return res.status(400).send({ message: "No face detected in query image." });
        }
        formData.faceDescriptor = Array.from(faceDescriptor);
        formData.role = Roles.EMPLOYEE;
      let newUser = await userService.createUser(formData);
      const today = new Date(); 
      const existingDailyAttendance = await dailyAttendanceService.getByDate(today);
      if (!existingDailyAttendance?.attendanceRecords?.some(user => user.userId.equals(newUser._id))) {
        existingDailyAttendance.attendanceRecords.push({ userId: newUser._id, status: Status.ABSENT });
      }

      await dailyAttendanceService.update(existingDailyAttendance._id, existingDailyAttendance);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      if(req?.file){
        fs.unlink(req?.file?.path, (err) => {
          if (err) {
            console.error("Failed to delete query image:", err);
          }
        });
      }
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await userService.deleteUser(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const today = new Date();
      const existingDailyAttendance = await dailyAttendanceService.getByDate(today);
      if (existingDailyAttendance) {
        existingDailyAttendance.attendanceRecords = existingDailyAttendance.attendanceRecords.filter(record => !record.userId.equals(id));
        await dailyAttendanceService.update(existingDailyAttendance._id, existingDailyAttendance);
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req, res){
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsersByRole(req, res, role) {
    try {
      const users = await userService.getUsersByRole(role);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllManagers(req, res) {
    this.getAllUsersByRole(req, res, Roles.MANAGER);
  }
  async getAllSupervisors(req, res) {
    this.getAllUsersByRole(req, res, Roles.SUPERVISOR);
  }
  async getAllHumanResources(req, res) {
    this.getAllUsersByRole(req, res, Roles.HR);
  }
  async getAllSecretaries(req, res) {
    this.getAllUsersByRole(req, res, Roles.SECRETARY);
  }
  async getAllEmployees(req, res) {
    this.getAllUsersByRole(req, res, Roles.EMPLOYEE);
  }

  async getAuthenticatedUser(req, res){
    res.status(200).json(req.user);
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ field: "general", message: "Email and password are required." });
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ field: "email", message: "User not found" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ field: "password", message: "Invalid credentials" });
      }

      const token = generateJwt(user);
      res.cookie("token", token, { httpOnly: true });
      res.status(201).json({ id: user.id, role: user.role });
    } catch (error) {
      res.status(500).json({ field: "general", message: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("token", { path: "/" });
    res.status(200).send({ message: "User has been log out." });
  }
}

export default new UserController();