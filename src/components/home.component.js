import React from "react";
import { Link } from "react-router-dom";
import PostService from '../services/post.service';
import speechBox from '../images/comment.png';
import CloseIcon from '@rsuite/icons/Close';

export default function Home(props) {
  const [postsArray, setPostsArray] = React.useState([])

  async function getAllPosts() {
    try {
      const posts = await PostService.getAllPosts()
      setPostsArray(posts.data)
    } catch(err) {
      console.log("err", err)
    }
  }

  React.useEffect(() => {
    getAllPosts()
  }, [])

  // async function deletePost(e, id) {
  //   e.preventDefault()
  //   try {
  //     const deletedPost = PostService.deletePost(id)
  //     if(!deletedPost) throw Error("Something went wrong deleting the post")
  //     getAllPosts()
  //   } catch(err) {
  //     console.log("err", err)
  //   }
  // }

  async function modDeletePost(e, id) {
    e.preventDefault()
    try {
      const deletedPost = await PostService.modDeletePost(id)
      if(!deletedPost) throw Error("Something went wrong deleteing the post")
      getAllPosts()
    } catch(err) {
      console.log("err", err)
    }
  }

  const postElements = postsArray.map(post => {
    return (
      <div
        key={post.id}
        className="post card"
        id={post.id}
      >
      {props.user.modPowers && <div
       className="close-icon"
       onClick={(e) => modDeletePost(e, post.id)}
      >
        <CloseIcon />
      </div>}
      <Link to={`/post/${post.id}`} className="navbar-brand">
        <h3>{post.title}</h3>
      </Link>
        <img src={post.imgUrl} alt="" />
        <p className="author">Posted by {post.user.username}</p>
          <div className="comment-container">
            <Link to={`/post/${post.id}`} className="navbar-brand">
              <img
                className="speech-box"
                src={speechBox} alt="speech-box" />
              <p className="comment-counter">{post.comments.length} comments</p>
            </Link>
          </div>
        <div className="route-container">
        </div>
      </div>
    )
  })

  return (
    <div className="container">
      <header className="jumbotron">
        {postElements}
      </header>
    </div>
  );
}
