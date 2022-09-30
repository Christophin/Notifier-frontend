import React from "react";
import Card from 'react-bootstrap/Card'
import { Link } from "react-router-dom";
import NewGroup from './new-group.component';


export default function Groups(props) {
  const [groups, setGroups] = React.useState([])
  React.useEffect(() => {
    setGroups(props.user.groups)

  }, [props.user.groups])

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
