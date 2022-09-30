import React from 'react'
import { Outlet, Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import Switch from "react-switch";
import CloseIcon from '@rsuite/icons/Close';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import plusIcon from '../images/plus-icon.png'
import questionMark from '../images/question-mark.png'
import ErrorService from '../services/error.service'
import EventService from '../services/event.service'
import SingleEvent from './event.component'
import DateTime from './date-time.component'

export default function GroupEvents(props) {
  const [show, setShow] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [target, setTarget] = React.useState(null);
  const ref = React.useRef(null);
  const handleToggle = () => setShow(prev => !prev);
  const [newEvent, setNewEvent] = React.useState({
    name: "",
    description: "",
    private: false
  })
  const [message, setMessage] = React.useState("")

  const handleClick = (event) => {
    setShowTooltip(!showTooltip);
    setTarget(event.target);
  };

  function onChange(e) {
    const {name, value, type, checked} = e.target
    setNewEvent(prev => {
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }
    })
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

  async function addEvent() {
    setMessage("")
    try {
      const res = await EventService.addEvent(props.group.id, newEvent)
      if(!res) throw Error("something went wrong with adding the event")
      if(res.message) {
        setMessage(res.message)
      }
      setNewEvent({
        name: "",
        description: ""
      })
      handleToggle()
      props.group.getGroup()
    } catch (err) {
      console.log("err", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  async function removeEvent(id) {
    setMessage("")
    try {
      const res = await EventService.removeEvent(props.group.id, id)
      if(!res) throw Error("Something went wrong with removing the event")
      if(res.message) {
        setMessage(res.message)
      }
      props.group.getGroup()
    } catch(err) {
      console.log("err in remove event", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  const eventElements = props.group.events.map(event => {
    return (
      <Card
        key={event.id}
        className="card event-card"
      >
        <Card.Body>
          <Link to={`/group/${props.group.id}/event/${event.id}`}
                className="navbar-brand">
            <span>{event.name}</span>
          </Link>
          {props.group.isAdmin &&
            <span
              className="close-icon"
              onClick={(e) => removeEvent(event.id)}
            >
              <CloseIcon />
            </span>
          }
        </Card.Body>
      </Card>
    )
  })

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Check to restrict this event to this group only.
    </Tooltip>
  );

  return (
    <div>
      <div>
        <h5 className="group-title">Events:</h5>
        { props.group.isLead && <img
          className="plus-icon"
          src={ plusIcon }
          alt="add member"
          onClick={ handleToggle } />}
      </div>
      {eventElements}

      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
      <Modal
        show={show}
        onHide={handleToggle}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Form
                onSubmit={addEvent}
              >
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newEvent.name}
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
                    value={newEvent.description}
                    onChange={onChange}
                    validations={[required]}
                  />
                </div>
                <input
                  type="checkbox"
                  name="private"
                  id="private"
                  className="private-input"
                  defaultChecked={newEvent.private}
                  onChange={onChange}
                />
                <label className="private-label" htmlFor="private">
                  Private
                </label>

                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <img
                    src={questionMark}
                    alt="question mark"
                    className="question-mark"
                    ref={ React.createRef(target) }
                    onClick={() => setShowTooltip(!showTooltip)}
                  />
                </OverlayTrigger>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleToggle}>
            Close
          </Button>
          <Button variant="secondary" onClick={addEvent}>
            Create
          </Button>
        </Modal.Footer>j
      </Modal>
      <Outlet />
    </div>
  )
}
