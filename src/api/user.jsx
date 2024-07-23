import { jsonInstance, photoInstance } from "./htttp-comon";

const baseUrl = "/user";
const http = jsonInstance;
const httpPhotoInstance = photoInstance

class UserService {
  async login(data) {
    return await http.post(`${baseUrl}/login`, data);
  }

  async logout() {
    return await http.post(`${baseUrl}/logout`);
  }

  async getAuthenticatedUser(){
    return await http.get(`${baseUrl}/auth/user`);
  }

  async createUser(data) {
    return await httpPhotoInstance.post(`${baseUrl}/`, data);
  }

  async createUserPublic(data) {
    return await httpPhotoInstance.post(`${baseUrl}/public`, data);
  }

  async getUserById(id) {
    return await http.get(`${baseUrl}/${id}`);
  }

  async updateUser(id, data) {
    return await http.put(`${baseUrl}/${id}`, data);
  }

  async deleteUser(id) {
    return await http.delete(`${baseUrl}/${id}`);
  }

  async getAllUsers() {
    return await http.get(`${baseUrl}/`);
  }
}

export default new UserService();