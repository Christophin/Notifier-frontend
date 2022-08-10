import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import plusIcon from '../images/plus-icon.png'
import leftArrow from '../images/left-arrow.png'
import Autosuggest from 'react-autosuggest';
import UserService from '../services/user.service'
import GroupService from '../services/group.service'
import ErrorService from '../services/error.service'
import CloseIcon from '@rsuite/icons/Close';

export default function GroupLeads(props) {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(prev => !prev);
  const [newAdmin, setNewAdmin] = React.useState("")
  const [suggestions, setSuggestions] = React.useState([])
  const [user, setUser] = React.useState({})
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

  async function addAdmin(id) {
    try {
      const res = await GroupService.addAdmin(props.group.id, id)
      if(!res) throw Error("something went wrong with adding the admin")
      if( res.response && res.response.status != 200) {
        setMessage(ErrorService.handleError(res))
      }
      props.getGroup()
    } catch (err) {
      console.log("err", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  async function removeLead(id) {
    try {
      const res = await GroupService.removeLead(props.group.id, id)
      if(!res) throw Error("Something went wrong with removing the lead")
      if( res.response && res.response.status != 200) {
        setMessage(ErrorService.handleError(res))
      }
      props.getGroup()
    } catch(err) {
      console.log("err in remove lead", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  const leadElements = props.group.leads.map(lead => {
    let isAdmin = false
    props.group.admins.forEach(admin => {
      if(admin.id === lead.id) {
        isAdmin = true
      }
    })
    return (
      <Card
        key={lead.id}
        className="card lead-card"
      >
        <Card.Body>
          {!isAdmin && props.group.isAdmin && <img
            className="left-arrow addLead"
            src={leftArrow}
            alt="add Lead"
            onClick={() => addAdmin(lead.id)} />}
          <span className="username">{lead.username}</span>
          {!isAdmin && props.group.isAdmin && <span
           className="close-icon"
           onClick={() => removeLead(lead.id)}
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
        <h5 className="group-title">Leads:</h5>
      </div>
      {leadElements}
      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
  )
}
