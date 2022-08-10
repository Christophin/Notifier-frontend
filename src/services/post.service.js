import axios from "axios";
import authHeader from './auth-header';

class PostService {
  newPost(title, imgUrl, user) {
    return axios
      .post( "/api/post/newpost", {
        title,
        imgUrl,
        user,
        votes: [user]
      }, {headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }
  getAllPosts() {
    return axios.get( "/api/post/all")
  }
  getOnePost(id) {
    return axios.get("/api/post/"+ id).then(res => {
      return res.data
    })
  }
  updatePost(title, id) {
    return axios.patch("/api/post/"+ id, {title}, { headers: authHeader()})
  }
  deletePost(id) {
    return axios.delete("/api/post/" + id, {headers: authHeader()})
  }
  modDeletePost(id) {
    return axios.delete("/api/post/mod/" + id, {headers: authHeader()})
  }
  allPostsByUser() {
    return axios.get("/api/post/user", {headers: authHeader()})
  }
}
export default new PostService();
