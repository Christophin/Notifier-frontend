import axios from "axios";
  const login = (username, password) => {
    return axios
      .post("/api/auth/signin", {
        username,
        password
      })
      .then(response => {
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  const logout = async () => {
    try {
      const resp = await axios.post("/api/auth/signout")
      if(!resp) throw Error("No Response")
      localStorage.removeItem("user");
      console.log("signing out the user")
      return resp.data
    } catch(err) {
      console.log("err", err)
      localStorage.removeItem("user")
      window.location.reload()
    }
  }
  const register = (username, email, password) => {
    return axios.post("/api/auth/signup", {
      username,
      email,
      password
    });
  }
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  }
  const updateCurrentUser = async() => {
    try {
      const resp = await axios.get("/api/auth/current")
      if(!resp) throw Error("something went wrong with getting the current user")
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(resp.data))
      console.log("update user", localStorage.getItem('user'));
    } catch(err) {
      console.log("err", err)
    }
    return JSON.parse(localStorage.getItem('user'));
  }

  const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    updateCurrentUser
  }
  export default AuthService;
