import React from "react";
import Card from 'react-bootstrap/Card'
import { Routes, Route, Link } from "react-router-dom";
import GroupService from '../services/group.service';
import NewGroup from './new-group.component';


export default function Groups(props) {
  const [groups, setGroups] = React.useState([])
  console.log(props.user)
  React.useEffect(() => {
    setGroups(props.user.groups)

  }, [groups])

  const groupElements = groups.map(group => {
    return (
      <div key={group.id}>
        <Card
          style={ { width: "18rem" } }
        >
          <Link to={`/group/${group.id}`}
              className="group-link">
            <Card.Header as="h5">{group.name}</ Card.Header>
            <Card.Body>
              <Card.Text>
                {group.description}
              </Card.Text>
            </Card.Body>
          </Link>
        </Card>
      </div>
    )
  })

  return (
    <div>
      <NewGroup user={props.user} />
      <h3>Your Groups:</h3>
      {groups && groupElements}
    </div>
  );
}
