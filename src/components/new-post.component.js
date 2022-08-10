import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import PostService from '../services/post.service'
import { useNavigate } from "react-router-dom";



export default function NewPost(props) {
  const navigate = useNavigate()
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(prev => !prev);
  const [newPost, setNewPost] = React.useState({
    title: "",
    imgUrl: "",
    user: props.user.id,
    votes: 0,
    message: ""
  })

  function onChange(e) {
    const {name, value} = e.target
    setNewPost(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  };

  async function handleNewPost(e) {
    e.preventDefault();
    setNewPost(prev => {
      return {
        ...prev,
        message: ""
      }
    })
    try {
      const res = await PostService.newPost(newPost.title, newPost.imgUrl, newPost.user)
      if(!res) throw Error("something went wrong creating the post")
      navigate("/home")
      window.location.reload()
    } catch(err) {
      console.log("err", err)
      const resMessage =
        (err.response &&
        err.response.data &&
        err.response.data.message) ||
        err.message ||
        err.toString();
        setNewPost(prev => {
          return {
            ...prev,
            message: resMessage
          }
        })
    }
  };

  const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };


  return (
    <div>
      <div onClick={handleToggle}>
        New Post
      </div>

      <Modal
        show={show}
        onHide={handleToggle}
        backdrop="static"
        keyboard={false}
      >
      <Modal.Header closeButton>
        <Modal.Title>New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-md-12">
          <div>
            <Form
              onSubmit={handleNewPost}
            >
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Input
                  type="text"
                  className="form-control"
                  name="title"
                  value={newPost.title}
                  onChange={onChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="imgLink">Image Url</label>
                <Input
                  type="text"
                  className="form-control"
                  name="imgUrl"
                  value={newPost.imgUrl}
                  onChange={onChange}
                  validations={[required]}
                />
              </div>
              {newPost.message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {newPost.message}
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleToggle}>
          Close
        </Button>
        <Button variant="primary" onClick={handleNewPost}>Create</Button>
      </Modal.Footer>
      </Modal>
    </div>
  );
}
