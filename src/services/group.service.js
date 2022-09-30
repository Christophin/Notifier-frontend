import axios from 'axios'
import ErrorService from './error.service'

const newGroup = async(name, description, userId) => {
  try {
    let res = await axios.post("/api/group", {
        name: name,
        description: description
    })
    if(!res) throw Error("something went wrong creating the group")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    return res.data
  } catch(err) {
    console.log("err", err)
    return ErrorService.handleError(err)
  }
}

const groupById = async(groupId) => {
  try {
    const res = await axios.get("/api/group/" + groupId)
    if(!res) throw Error("something went wrong getting the group")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    return res.data
  } catch(err) {
    console.log("err", err)
    return ErrorService.handleError(err)
  }
}

const addUserToGroup = async(groupId, username) => {
  try {
    const res = await axios.put("/api/group/member/" + groupId, { username: username })
    if(!res) throw Error("Something went wrong adding a member to the group")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    return res.data
  } catch(err) {
    console.log("error in add user", err.response.data.message);
    return ErrorService.handleError(err)
  }
}

const removeMember = async(groupId , userId) => {
  try {
    const res = await axios.put("/api/group/member/remove/" + groupId, { id: userId })
    if(!res) throw Error("something went wrong with removing the member from the group")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    return res.data
  } catch(err) {
    console.log("err", err);
    return ErrorService.handleError(err)
  }
}

const addLead = async(groupId, userId) => {
  try {
    const res = await axios.put("/api/group/lead/" + groupId, { id: userId })
    if(!res) throw Error("something went wrong with adding the lead")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    console.log("res in addLead service");
    return res.data
  } catch(err) {
    console.log("err in addlead service", err)
    return ErrorService.handleError(err)
  }
}

const removeLead = async(groupId, userId) => {
  try {
    const res = await axios.put("/api/group/lead/remove/" + groupId, { id: userId})
    if(!res) throw Error("Something went wrong with removing the lead")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    console.log("We removed the lead");
    return res.data
  } catch(err) {
    console.log("err in remove lead", err);
    return ErrorService.handleError(err)
  }
}

const addAdmin = async(groupId, userId) => {
  try {
    const res = await axios.put("/api/group/admin/" + groupId, { id: userId })
    if(!res) throw Error("Something went wrong adding the admin")
    console.log("res in add admin service", res);
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    return res.data
  } catch(err) {
    console.log("err in addAdmin", err);
    return ErrorService.handleError(err)
  }
}

const removeAdmin = async(groupId, userId) => {
  try {
    const res = await axios.put("/api/group/admin/remove/" + groupId, { id: userId })
    if(!res) throw Error("Something went wrong removing the Admin")
    console.log("res in remove admin service", res);
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    return res.data
  } catch(err) {
    console.log("err in remove admin service", err);
    return ErrorService.handleError(err)
  }
}

const GroupService = {
  newGroup,
  groupById,
  addUserToGroup,
  removeMember,
  addLead,
  removeLead,
  addAdmin,
  removeAdmin
}
export default GroupService;
