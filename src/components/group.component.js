import React from "react";
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AuthService from '../services/auth.service'
import GroupService from '../services/group.service';
import GroupAdmins from './group-admins.component';
import GroupMembers from './group-members.component';
import GroupLeads from './group-leads.component';
import plusIcon from '../images/plus-icon.png';

export default function Group(props) {
  const { id } = useParams()
  const [loading, setLoading] = React.useState(true)
  const [group, setGroup] = React.useState({})
  const [user, setUser] = React.useState(AuthService.getCurrentUser())
  async function getGroup() {
    try {
      const groupById = await GroupService.groupById(id)
      if(!groupById) throw Error("Group not found")
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
        isLead: isGroupLead
      })
      setLoading(false)
    } catch(err) {
      console.log("err", err)
    }
  }

  React.useEffect(() => {
    getGroup()
  }, [])

  if(loading) {
    return (
      <p>Data is loading...</p>
    )
  }

  const eventElements = group.events.map(event => {
    return (
      <Card key={event.id}>
        <Card.Body>{event.name}</Card.Body>
      </Card>
    )
  })

  return (
    <div>
      <h3>{group.name}</h3>
      <p>{group.description}</p>
      <Container fluid>
        <Row>
          <Col>
            <GroupAdmins
              group={group}
              getGroup={() => getGroup()} />
          </Col>
          <Col>
            <GroupLeads
              group={group}
              getGroup={() => getGroup()} />
          </Col>
          <Col>
            <GroupMembers
              group={group}
              getGroup={() => getGroup()} />
          </Col>
        </Row>
        <Row>
        <div>
          <h5 className="group-title">Events:</h5>
          <img className="plus-icon" src={plusIcon} alt="add member" />
        </div>
          {eventElements}
        </Row>
      </Container>
    </div>

  )
};
