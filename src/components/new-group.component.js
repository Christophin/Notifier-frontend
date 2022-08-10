import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import GroupService from '../services/group.service';

export default function NewGroup(props) {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(prev => !prev)
  const [newGroup, setNewGroup] = React.useState({
    name: "",
    description: "",
    creator: props.user.id,
    message: ""
  })

  function onChange(e) {
    const {name, value} = e.target
    setNewGroup(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  };

  async function handleNewGroup (e) {
    e.preventDefault();
    setNewGroup(prev => {
      return {
        ...prev,
        message: ""
      }
    })
    try {
      const group = GroupService.newGroup(newGroup.name, newGroup.description, newGroup.user);
      if(!group) throw Error("Something went wrong with creating the group")
      console.log("Group saved!!")
      setNewGroup({
        name: "",
        description: "",
        creator: props.user.id,
        message: ""
      })
      handleToggle()
    } catch(err) {
      console.log("err", err)
      const resMessage =
        (err.response &&
        err.response.data &&
        err.response.data.message) ||
        err.message ||
        err.toString();
        setNewGroup(prev => {
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
      <Button variant="primary" onClick={handleToggle}>
        Create New Group
      </Button>

      <Modal
        show={show}
        onHide={handleToggle}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div >
            <div >
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newGroup.name}
                    onChange={onChange}
                    validations={[required]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="description"
                    value={newGroup.description}
                    onChange={onChange}
                    validations={[required]}
                  />
                </div>

                {newGroup.message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {newGroup.message}
                    </div>
                  </div>
                )}
                <CheckButton
                  style={{ display: "none" }}
                />
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleToggle}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNewGroup}>Understood</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
