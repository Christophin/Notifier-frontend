import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};
const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};
const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default function Register() {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(prev => !prev)
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
    successful: false,
    message: ""
  })

  function handleChange(e) {
    const {name, value} = e.target
        setUser(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
  }

  function handleRegister(e) {
    e.preventDefault();
    setUser(prev => {
      return {
        ...prev,
        successful: false,
        message: ""
      }
    })
    AuthService.register(user.username, user.email, user.password)
      .then(
        res => {
          setUser(() => {
            return {
              successful: true,
              message: res.data.message
            }
          })
        },
        err => {
          const resMessage =
            (err.response &&
              err.response.data &&
              err.response.data.message) ||
            err.message ||
            err.toString();
          setUser(prev => {
            return {
              ...prev,
              successful: false,
              message: resMessage
            }
          })
        }
      )
  }

  return (
    <div className="">
      <Button variant="link"
              className="nav-link"
              onClick={handleToggle}>Sign Up</Button>

      <Modal
        show={show}
        onHide={handleToggle}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
                <div className="card-container">
                  <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                  />
                  <Form
                    onSubmit={handleRegister}
                  >
                    {!user.successful && (
                      <div>
                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            validations={[required, vusername]}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            validations={[required, email]}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            validations={[required, vpassword]}
                          />
                        </div>
                      </div>
                    )}
                    {user.message && (
                      <div className="form-group">
                        <div
                          className={
                            user.successful
                              ? "alert alert-success"
                              : "alert alert-danger"
                          }
                          role="alert"
                        >
                          {user.message}
                        </div>
                      </div>
                    )}
                  </Form>
                </div>
            </Card.Body>
          </Card>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleToggle}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
