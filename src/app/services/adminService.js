import axios from "axios";
export default class AdminService {
  async getAdmin(token, adminId) {
    console.log(adminId);
    console.log(token);
    return await axios.get(
      `${process.env.EXPO_PUBLIC_GET_ADMIN_URL}/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
