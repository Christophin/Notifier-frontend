import axios from "axios";
import authHeader from './auth-header';

class CommentService {
  newComment(comment, post) {
    return axios.post("/api/comment/" + post, {
      content: comment
    }, {headers: authHeader()})
      .then(
        res => {
          return res.data
        },
        err => {
          console.log(err)
          return err
        })
  }
}

export default new CommentService();
