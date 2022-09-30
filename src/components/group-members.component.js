import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import plusIcon from '../images/plus-icon.png'
import leftArrow from '../images/left-arrow.png'
import Autosuggest from 'react-autosuggest';
import UserService from '../services/user.service'
import GroupService from '../services/group.service'
import ErrorService from '../services/error.service'
import CloseIcon from '@rsuite/icons/Close';

export default function GroupMembers(props) {
  const [show, setShow] = React.useState(false);
  const [newMember, setNewMember] = React.useState("")
  const [suggestions, setSuggestions] = React.useState([])
  const [message, setMessage] = React.useState("")
  const handleShow = () => {
    setShow(true)
  }
  const handleClose = () => {
    setNewMember("")
    setShow(false)
    setMessage("")
  }

  function handleChange(e) {
    if(e.target.value) {
      setNewMember(e.target.value)
    } else if(e.target.textContent) {
      setNewMember(e.target.textContent)
    } else {
      setNewMember('')
    }
  }

  async function handleNewMember(e) {
    setMessage("")
    try {
      const res = await GroupService.addUserToGroup(props.group.id, newMember)
      if(res.message) {
        setMessage(res.message)
      }
      handleClose()
      props.group.getGroup()
    } catch(err) {
      console.log("error", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  async function removeMember(e, userId) {
    setMessage("")
    try {
      const res = await GroupService.removeMember(props.group.id, userId)
      if(!res) throw Error("Something went wrong removing the member from the group")
      if( res.message) {
        setMessage(res.message)
      }
      props.group.getGroup()
    } catch(err) {
      console.log("err", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  async function addLead(userId) {
    setMessage("")
    try{
      const res = await GroupService.addLead(props.group.id, userId)
      if(!res) throw Error("Something went wrong with adding the lead")
      if( res.message) {
        setMessage(res.message)
      }
      props.group.getGroup()
    } catch(err) {
      console.log("err in add lead", err)
      setMessage(ErrorService.handleError(err))
    }
  }

  async function onSuggestionsFetchRequested({ value, reason }) {
    if(reason !== 'input-focused') {
      try {
        const res = await UserService.autoSuggest(newMember)
        if(!res) throw Error("something went wrong getting autosuggestions")
        if( res.message) {
          setMessage(res.message)
        } else {
          setSuggestions(res.data)
        }
      } catch(err) {
        console.log("err", err)
        setMessage(ErrorService.handleError(err))
      }
    }
  }

  function onSuggestionSelected(event, { suggestion, suggestionValue, index, method }) {
  }

  function onSuggestionsClearRequested() {
    setSuggestions([])
  }

  function shouldRenderSuggestions(value, reason) {
    return value.trim().length > 2;
  }



  const getSuggestionValue = suggestion => suggestion.username;

  const renderSuggestion = suggestion => (
    <div>
      {suggestion.username}
    </div>
  );

  const inputProps = {
      placeholder: 'Search for a user',
      value: newMember,
      onChange: handleChange
    };

  const memberElements = props.group.members.map(member => {
    let isLead = false
    props.group.leads.forEach(lead => {
      if(lead.id === member.id) {
        isLead = true
      }

    })
    return (
      <Card
        key={member.id}
        className="card member-card"
      >
        <Card.Body>
          {!isLead && props.group.isAdmin && <img
              className="left-arrow addLead"
              src={leftArrow}
              alt="add Lead"
              onClick={() => addLead(member.id)} />
          }
          <span className="username">
            {member.username}
          </span>
          {!isLead && props.group.isAdmin && <span
           className="close-icon"
           onClick={(e) => removeMember(e, member.id)}
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
        <h5 className="group-title">Members:</h5>
        {props.group.isAdmin && <img
          className="plus-icon addAdmin"
          src={plusIcon}
          alt="add User"
          onClick={handleShow} />}

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>New Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestedSelected={onSuggestionSelected}
                shouldRenderSuggestions={shouldRenderSuggestions}
                onSuggestionSelected={onSuggestionSelected}
              />
            </Modal.Body>
            <Modal.Footer>
              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleNewMember}>Add Member</Button>
            </Modal.Footer>
          </Modal>
      </div>
      {memberElements}
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
