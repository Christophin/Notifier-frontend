import axios from 'axios';
import authHeader from './auth-header';
class UserService {
  getPublicContent() {
    return axios.get('/api/all');
  }
  getUserBoard() {
    return axios.get('/api/test/user', { headers: authHeader() });
  }
  getModeratorBoard() {
    return axios.get('/api/test/mod', { headers: authHeader() });
  }
  getAdminBoard() {
    return axios.get('/api/user/admin');
  }
  adminUserRoles(value, id) {
    return axios.put('/api/user/admin/' + id, {value: value});
  }
  autoSuggest(value) {
    return axios.get('/api/user/admin/autosuggest?value=' + value)
  }
}
export default new UserService();
