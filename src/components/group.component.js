import React from "react";
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AuthService from '../services/auth.service'
import GroupService from '../services/group.service';
import GroupAdmins from './group-admins.component';
import GroupMembers from './group-members.component';
import GroupLeads from './group-leads.component';
import GroupEvents from './group-events.component';

export default function Group(props) {
  const { id } = useParams()
  const [loading, setLoading] = React.useState(true)
  const [group, setGroup] = React.useState({})
  const [user, setUser] = React.useState(AuthService.getCurrentUser())
  const [message, setMessage] = React.useState("")

  const getGroup = React.useCallback(async() => {
    try {
      const groupById = await GroupService.groupById(id)
      if(!groupById) throw Error("Group not found")
      if(groupById.message) {
        setMessage(groupById.message)
      }
      setUser(AuthService.getCurrentUser())
      let isGroupAdmin = false
      groupById.admins.forEach(admin => {
        if(admin.id === user.id) {
          isGroupAdmin = true
        }
      })
      let isGroupLead = false
      groupById.leads.forEach(lead => {
        if(lead.id === user.id) {
          isGroupLead = true
        }
      })
      setGroup({
        ...groupById,
        isAdmin: isGroupAdmin,
        isLead: isGroupLead,
        getGroup: () => getGroup()
      })
      setLoading(false)
    } catch(err) {
      console.log("err", err)
    }
  }, [user.id])

  React.useEffect(() => {
    getGroup()
  }, [getGroup])

  if(loading) {
    return (
      <p>Data is loading...</p>
    )
  }

  return (
    <div>
      <h3>{ group.name }</h3>
      <p>{ group.description }</p>
      <Container fluid>
        <Row>
          <Col>
            <GroupAdmins group={ group } />
          </Col>
          <Col>
            <GroupLeads group={ group } />
          </Col>
          <Col>
            <GroupMembers group={group} />
          </Col>
        </Row>
        <Row>
        <div>
          <GroupEvents group={ group } />
        </div>
        </Row>
      </Container>
      { message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            { message }
          </div>
        </div>
      )}
    </div>

  )
};
