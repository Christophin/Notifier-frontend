import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-validation/build/form";
import Card from 'react-bootstrap/Card'
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate()
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(prev => !prev)
  const [user, setUser] = React.useState({
    username: "",
    password: "",
    message: ""
  })

  function onChange(e) {
    e.preventDefault()
    const {name, value} = e.target
    setUser(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  };

  async function handleLogin(e) {
    e.preventDefault();
    setUser(prev => {
      return {
        ...prev,
        message: ""
      }
    })
    //this.form.validateAll();
    try {
      const login = await AuthService.login(user.username, user.password)
      if(!login) throw Error("Login Failed")
      navigate("/profile");
      window.location.reload();
    } catch(error) {
      const resMessage =
        (error.response &&
          error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString();
      setUser(prev => {
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
    <div className="">
      <Button variant="link"
              className="nav-link"
              onClick={handleToggle}>Login</Button>

      <Modal
        show={show}
        onHide={handleToggle}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</ Modal.Title>
        </ Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div>
                <img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className="profile-img-card"
                />
                <Form
                  onSubmit={handleLogin}
                >
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={user.username}
                      onChange={onChange}
                      validations={[required]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="password"
                      value={user.password}
                      onChange={onChange}
                      validations={[required]}
                    />
                  </div>
                  {user.message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {user.message}
                      </div>
                    </div>
                  )}

                </Form>
              </div>
            </Card.Body>
          </Card>
        </ Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleToggle}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </ Modal>

    </div>
  );
}
