import React from "react";
import PostService from '../services/post.service'
import CloseIcon from '@rsuite/icons/Close';

export default function BoardUser() {
  const [board, setBoard] = React.useState([])


  async function getPostsByUser() {
    try {
      const posts = await PostService.allPostsByUser();
      if(!posts) throw Error("something went wrong with getting the posts")
      setBoard(posts.data)
    } catch(err) {
      console.log("err", err)

    }
  }
  React.useEffect(() => {
        getPostsByUser()
  }, [])

  async function deletePost(e, id) {
    try {
      const deleted = await PostService.deletePost(id);
      if(!deleted) throw Error("Something went wrong with deleting the post")
      getPostsByUser()
    } catch(err) {
      console.log("err", err)
    }
  }

  const boardElements = board.map(post => {
    return (
      <div
        key={post.id}
        className="post card"
      >
        <span className="trash-bin-container">
          <h3>{post.title}</h3>

          <div
           className="close-icon"
           onClick={(e) => deletePost(e, post.id)}
          >
            <CloseIcon />
          </div>
        </span>
        <img src={post.imgUrl} alt="" />

      </div>
    )
  })
  return (
    <div className="container">
      <header className="jumbotron">
        {boardElements}
      </header>
    </div>
  );
}
