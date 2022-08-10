import React, { useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PostService from '../services/post.service'
import CommentService from '../services/comment.service'
import CloseIcon from '@rsuite/icons/Close';

export default function Post(props) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = React.useState({})
  const [comment, setComment] = React.useState("")

  const updatePost = useCallback(async() => {
    try {
      const post = await PostService.getOnePost(id)
      if(!post) throw Error("something went wrong finding the post")
      setPost(post)
    } catch(err) {
      console.log("err", err)
    }
}, [id])

  React.useEffect(() => {
    updatePost()
  }, [updatePost])

  async function modDeletePost(e, id) {
    e.preventDefault()
    try {
      const deletedPost = await PostService.modDeletePost(id)
      if(!deletedPost) throw Error("Something went wrong deleteing the post")
      navigate("/home")
      window.location.reload()
    } catch(err) {
      console.log("err", err)
    }
  }

  function handleChange(e) {
    e.preventDefault()
    setComment(e.target.value);
  }

  function newComment(e) {
    e.preventDefault()
    CommentService.newComment(comment, id).then(
      res => {
        setComment("")
        updatePost()
      },
      err => {
        console.log("error in adding comment", err)
      }
    )
  }

  const commentElements = post && post.comments && post.comments.map(comment => {
    return (
      <div
        key={comment.id}
        className="comment card">
        <div>{comment.user.username}:</div>
        <div>{comment.content}</div>
      </div>
    )
  });

  return (
    <div className="card">

    {props.user.isMod && (
       <div
        className="close-icon"
        onClick={(e) => modDeletePost(e, id)}
       >
        <CloseIcon />
      </div>
    )}
      <h3>{post.title}</h3>

      <img src={post.imgUrl} alt="" />
      <p className="author">Posted by {post.user && post.user.username}</p>
      <div className="comment-box">
        <textarea
          placeholder="What are your thoughts?"
          name="comment"
          value={comment}
          onChange={handleChange} />
          <div>
            <button
              className="btn btn-primary btn-block"

              onClick={newComment}>
              Post Comment
            </button>
          </div>
          {commentElements}
      </div>

    </div>
  )
}
