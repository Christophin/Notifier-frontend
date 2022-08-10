import React from "react";


export default function Profile(props) {
  console.log("props", props.user)
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{props.user.username}</strong> Profile
        </h3>
      </header>
      <p>
      </p>
      <p>
        <strong>Id:</strong>{" "}
        {props.user.id}
      </p>
      <p>
        <strong>Email:</strong>{" "}
        {props.user.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {props.user.roles &&
          props.user.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
}
// export default class Profile extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       currentUser: AuthService.getCurrentUser()
//     };
//   }
//   render() {
//     const { currentUser } = this.state;
//     return (
//       <div className="container">
//         <header className="jumbotron">
//           <h3>
//             <strong>{currentUser.username}</strong> Profile
//           </h3>
//         </header>
//         <p>
//           <strong>Token:</strong>{" "}
//           {currentUser.accessToken.substring(0, 20)} ...{" "}
//           {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
//         </p>
//         <p>
//           <strong>Id:</strong>{" "}
//           {currentUser.id}
//         </p>
//         <p>
//           <strong>Email:</strong>{" "}
//           {currentUser.email}
//         </p>
//         <strong>Authorities:</strong>
//         <ul>
//           {currentUser.roles &&
//             currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
//         </ul>
//       </div>
//     );
//   }
// }
