import React from 'react'
import { useParams } from 'react-router-dom';
import Switch from 'react-switch'
import ErrorService from '../services/error.service'
import EventService from '../services/event.service'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DateTimePicker from 'react-datetime-picker';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

export default function SingleEvent(props) {
  const { id, eventId } = useParams()
  const [message, setMessage] = React.useState("")
  const [value, setValue] = React.useState(new Date());
  const [singleEvent, setSingleEvent] = React.useState({
    enabled: false,
    recurring: false,
    restricted: false
  })
  const [radioValue, setRadioValue] = React.useState("daily");
  const radios = [
    { name: 'Daily', value: 'daily' },
    { name: 'Weekly', value: 'weekly' },
    { name: 'Monthly', value: 'monthly' },
    { name: 'Yearly', value: 'yearly'}
  ];

  async function onChange(val) {
    setMessage("")
    // toISOString()
    setValue(val)
    console.log("to ISO String", val.toISOString());
    try {
      const data = await EventService.reminderTime(id, singleEvent.id, val.toISOString())
      if(!data) throw Error("Seomthgin went wrong changing the reminder time")
      if(data.message) {
        setMessage(data.message)
      } else {
        console.log("we did it in onchange", data);
        setValue(new Date (data.reminderTime))
        setSingleEvent(data)
      }
    } catch(err) {
      console.log("err in set reminder time", err);
      setMessage(ErrorService.handleError(err))
    }

  }

  async function onRadioChange(e) {
    setMessage("")
    console.log("e.current value", e.currentTarget.value);
    try {
      const data = await EventService.changeRepeat(id, singleEvent.id, e.currentTarget.value)
      if(!data) throw Error("Something went wrong changing the repeat")
      if(data.message) {
        setMessage(data.message)
      } else {
        console.log("we did it in change repeat");
        setRadioValue(data.repeat)
        setSingleEvent(data)
      }
    } catch(err) {
      console.log("err in change repeat", err);
      setMessage(ErrorService.handleError(err))
    }

  }

  async function getEvent() {
    try {
      const data = await EventService.getEvent(eventId)
      if(!data) throw Error("Something went wrong with getting the event")
      if(data.message) {
        setMessage(data.message)
      }
      setValue(new Date(data.reminderTime))
      setRadioValue(data.repeat)
      setSingleEvent(data)

    } catch(err) {
      console.log("err in single event", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  React.useEffect(() => {
    getEvent()
  }, [eventId])

  async function toggle(checked, e, name) {
    console.log("e", checked, e, singleEvent[name]);
    setMessage("")
    try {
      const data = await EventService.toggleEventBools(id, eventId, name, !singleEvent[name])
      if(!data) throw Error("something went wrong toggling event enabled")
      if(data.message) {
        setMessage(data.message)
      }
      getEvent()

    } catch(err) {
      console.log("err in toggleEnabled", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  return (
    <div className="event-container">
      <Card>
        <Card.Header>
          <Card.Title>
            {singleEvent.name}
          </Card.Title>
        </Card.Header>
        <Card.Body className="event-body">
          <Card.Text>{singleEvent.description}</Card.Text>
          <Container fluid>
            <Row>
              <Col>
                <div
                  className="toggle-switch-container">
                  <span className="toggle-switch-label">Enabled:</span>
                  {singleEvent && <Switch
                      className="toggle-switch"
                      onChange={toggle}
                      name="enabled"
                      id="enabled"
                      checked={singleEvent.enabled}
                    />
                  }
                </div>
              </Col>
              <Col>
                <div
                  className="toggle-switch-container">
                  <span className="toggle-switch-label">Recurring:</span>
                  {singleEvent && <Switch
                      className="toggle-switch react-switch"
                      name="recurring"
                      id="recurring"
                      onChange={toggle}
                      checked={singleEvent.recurring}
                    />
                  }
                </div>
              </Col>
              <Col>
                <div
                  className="toggle-switch-container">
                  <span className="toggle-switch-label">Private:</span>
                  {singleEvent && <Switch
                      className="toggle-switch"
                      name="restricted"
                      id="restricted"
                      onChange={toggle}
                      checked={singleEvent.restricted}
                    />
                  }
                </div>
              </Col>
            </Row>
            {singleEvent.recurring &&
              <Row className="margin-top">
                <Col>
                  <ButtonGroup>
                    {radios.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={'outline-success'}
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={onRadioChange}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            }
            <Row>
              <div className="date-time-container">
                <label>
                  <span>Reminder Time :  </span>
                  <DateTimePicker onChange={onChange} value={value} />
                </label>
              </div>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      { message &&
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            { message }
          </div>
        </div>
      }

    </div>
  )
}
