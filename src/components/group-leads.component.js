import React from 'react'
import Card from 'react-bootstrap/Card'
import leftArrow from '../images/left-arrow.png'
import GroupService from '../services/group.service'
import ErrorService from '../services/error.service'
import CloseIcon from '@rsuite/icons/Close';

export default function GroupLeads(props) {
  const [message, setMessage] = React.useState("")

  async function addAdmin(id) {
    try {
      const res = await GroupService.addAdmin(props.group.id, id)
      if(!res) throw Error("something went wrong with adding the admin")
      if(res.message) {
        setMessage(res.message)
      }
      props.group.getGroup()
    } catch (err) {
      console.log("err", err);
      setMessage(ErrorService.handleError(err))
    }
  }

  async function removeLead(id) {
    try {
      const res = await GroupService.removeLead(props.group.id, id)
      if(!res) throw Error("Something went wrong with removing the lead")
      if(res.message) {
        setMessage(res.message)
      }
      props.group.getGroup()
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
