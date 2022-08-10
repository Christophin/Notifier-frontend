import React, { useCallback } from "react";
import UserService from "../services/user.service";

export default function BoardAdmin(props) {
  const [usersArray, setUsersArray] = React.useState([])

  const updateUsers = useCallback(async () => {
    try {
      const users = await UserService.getAdminBoard()
      if(!users) throw Error("Something went wrong with getting the users")
      const userRoles = users.data.map(user => {
        return {
          ...user,
          isMod: user.roles.includes("ROLE_MODERATOR"),
          isAdmin: user.roles.includes("ROLE_ADMIN"),
          isBanned: user.roles.includes("ROLE_BANNED"),
          modPowers: false
        }
      })
      setUsersArray(userRoles)
    } catch(err) {
      const resMessage =
        (err.response &&
          err.response.data &&
            err.response.data.message) ||
        err.message ||
        err.toString();
      setUsersArray(prev => {
        prev.push(resMessage)
      })
    }


  }, [])

  React.useEffect(() => {
    updateUsers()
  }, [updateUsers])

  async function handleChange(e, id) {
    try {
      const adminRoles = await UserService.adminUserRoles(e.target.value, id)
      if(!adminRoles) throw Error("Something went wrong changing the users role.")
      updateUsers()
    } catch(err) {
      console.log("error changin user roles", err)
    }
  }

  const admins = usersArray.filter(user => {
    return user.isAdmin
  })

  const adminsElements = admins.map(admin => {
    return (
      <div
        key={admin.id}
        className="admin-card card"
      >
        {admin.username}
        <div className="select-box">
          <select className="select" value="choose" onChange={(e) => handleChange(e, admin.id)}>
            <option disabled value="choose">Choose an option</option>
            {props.user.id === admin.id ? "" : <option value="remove-admin">Remove Admin</option>}
            {!admin.isMod && <option value="add-moderator">Make Moderator</option>}
          </select>
        </div>
      </div>
    )
  })

  const moderators = usersArray.filter(user => {
    return user.isMod
  })

  const moderatorsElements = moderators.map(moderator => {
    return (
      <div
        key={moderator.id}
        className="moderator-card card"
      >
        {moderator.username}
        <div className="select-box">
          <select className="select" value="choose" onChange={(e) => handleChange(e, moderator.id)}>
            <option disabled value="choose">Choose an option</option>
            <option value="remove-moderator">Remove Moderator</option>
            {moderator.isAdmin? "" : <option value="add-admin">Make Admin</option>}
          </select>
        </div>

      </div>
    )
  })

  const users = usersArray.filter(user => {
    return !user.isAdmin && !user.isMod && !user.isBanned
  })

  const usersElements = users.map(user => {
    return (
      <div
        key={user.id}
        className="user-card card"
      >
        {user.username}
        <div className="select-box">
          <select className="select" value="choose" onChange={(e) => handleChange(e, user.id)}>
            <option disabled value="choose">Choose an option</option>
            <option value="add-banned">Ban</option>
            <option value="add-moderator">Make Moderator</option>
            <option value="add-admin">Make Admin</option>
          </select>
        </div>
      </div>
    )
  })

  const bannedUsers = usersArray.filter(user => user.isBanned)

  const bannedUsersElements = bannedUsers.map(user => {
    return (
      <div
        key={user.id}
        className="banned-user-card card"
      > {user.username}
      <div className="select-box">
        <select className="select" value="choose" onChange={(e) => handleChange(e, user.id)}>
          <option disabled value="choose">Choose an option</option>
          <option value="remove-banned">Unban</option>
        </select>
      </div>
      </div>
    )
  })



  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admins</h3>
        {adminsElements}
        <h3>Moderators</h3>
        {moderatorsElements}
        <h3>Users</h3>
        {usersElements}
        <h3>Banned Users</h3>
        {bannedUsersElements}
      </header>
    </div>
  );
}
