import axios from 'axios'
import ErrorService from './error.service';

const addEvent = async(groupId, newEvent) => {
    try {
      const res = await axios.post(`/api/group/${groupId}/event`, {
        name: newEvent.name,
        description: newEvent.description,
        private: newEvent.private
      })
      if(!res) throw Error("Something went wrong with creating the event")
      if(res.status !== 200) {
        return ErrorService.handleError(res)
      }
      console.log("we did it!", res)
      return res.data
    } catch(err) {
      console.log("err in add event", err);
      return ErrorService.handleError(err)
    }
}

const getEvent = async(eventId) => {
  console.log("We did it get event");
  try {
    const res = await axios.get("/api/event/" + eventId)
    if(!res) throw Error("Something went wrong with getting the event")
    if(res.status !== 200) {
      return ErrorService.handleError(res)
    }
    console.log("we did it", res);
    return res.data
  } catch(err) {
    console.log("err in get event", err);
    return ErrorService.handleError(err)
  }
}

const removeEvent = async(groupId, eventId) => {
  console.log("We did it in remove event", groupId, eventId);
  try {
    const res = await axios.delete(`/api/group/${groupId}/event/${eventId}`)
    if(!res) throw Error("Something went wrong deleteing the event")
    if(res.status !== 200) {
      console.log("error in removeEvent", res);
      return ErrorService.handleError(res)
    }
    console.log("we did it", res.data);
    return res.data
  } catch(err) {
    console.log("err in remove event", err);
    return ErrorService.handleError(err)
  }
}

const toggleEventBools = async(groupId, eventId, name, value) => {
  try {
    const res = await axios.put(`/api/group/${groupId}/event/${eventId}`, { name: name, value: value })
    if(!res) throw Error("Something went wrong toggling event enabled")
    if(res.status !== 200) {
      console.log("error in toggleEnabled", res);
      return ErrorService.handleError(res)
    }
    console.log("we did it");
    return res.data
  } catch(err) {
    console.log("err in toggleEnabled", err);
    return ErrorService.handleError(err)
  }
}

const reminderTime = async(groupId, eventId, reminderTime) => {
  try {
    const res = await axios.put(`/api/group/${groupId}/event/${eventId}/reminderTime`, { reminderTime: reminderTime })
    if(!res) throw Error("Something went wrong changing the reminder tiem")
    if(res.status !== 200) {
      console.log("Error in remindertime", res);
      return ErrorService.handleError(res)
    }
    console.log("we did it remindertime", res);
    return res.data
  } catch(err) {
    console.log("err in remindertime", err);
    return ErrorService.handleError(err)
  }
}

const changeRepeat = async(groupId, eventId, repeat) => {
  try {
    const res = await axios.put(`/api/group/${groupId}/event/${eventId}/repeat`, { repeat: repeat })
    if(!res) throw Error("seomthign went wrong with changing teh repeat")
    if(res.status !== 200) {
      console.log("err in change repeat", res);
      return ErrorService.handleError(res)
    }
    console.log("we did it change repeat", res);
    return res.data
  } catch(err) {
    console.log("err in change repeat", err);
    return ErrorService.handleError(err)
  }
}

const EventService = {
  addEvent,
  getEvent,
  removeEvent,
  toggleEventBools,
  reminderTime,
  changeRepeat
}

export default EventService;
