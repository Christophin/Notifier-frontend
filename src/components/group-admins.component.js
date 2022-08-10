import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import plusIcon from '../images/plus-icon.png'
import Autosuggest from 'react-autosuggest';
import AuthService from '../services/auth.service'
import UserService from '../services/user.service';
import GroupService from '../services/group.service';
import ErrorService from "../services/error.service"
import CloseIcon from '@rsuite/icons/Close';

export default function GroupAdmins(props) {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(prev => !prev);
  const [newAdmin, setNewAdmin] = React.useState("")
  const [suggestions, setSuggestions] = React.useState([])
  const [user, setUser] = React.useState(AuthService.getCurrentUser())
  const [message, setMessage] = React.useState("")

  function handleChange(e) {
    if(e.target.value) {
      setNewAdmin(e.target.value)
    } else if(e.target.textContent) {
      setNewAdmin(e.target.textContent)
    } else {
      setNewAdmin('')
    }
  }

  const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };

  async function removeAdmin(userId) {
    try {
      const res = await GroupService.removeAdmin(props.group.id, userId)
      if(!res) throw Error("something's gone wrong with removing the admin")
      if( res.response && res.response.status != 200) {
        setMessage(ErrorService.handleError(res))
      }
      props.getGroup()
    } catch(err) {
      console.log("err in remove admin", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  const adminElements = props.group.admins.map(admin => {
    let isUser = false
    if(admin.id === user.id) {
      isUser = true
    }
    return (
      <Card
        key={admin.id}
        className="card admin-card"
      >
        <Card.Body>
          {admin.username}
          {!isUser && props.group.isAdmin && <span
           className="close-icon"
           onClick={() => removeAdmin(admin.id)}
          >
            <CloseIcon />
          </span>}
        </Card.Body>
      </Card>
    )
  })

  return (
    <div>
      <div>
        <h5 className="group-title">Admins:</h5>
      </div>
      {adminElements}
    </div>
  )
}
