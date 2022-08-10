import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Groups from "./components/groups.component";
import Group from './components/group.component'
import BoardAdmin from "./components/board-admin.component";
import Meme from './components/meme.component';
import NewPost from './components/new-post.component';
import Post from './components/post.component';


export default function App() {
  const navigate = useNavigate()
  const [user, setUser] = React.useState({})

  function getUser() {
    console.log("Inside get user!!");
    const user = AuthService.getCurrentUser()
    if(user) {
      setUser({
        ...user,
        isMod: user.roles.includes("ROLE_MODERATOR"),
        isAdmin: user.roles.includes("ROLE_ADMIN"),
        modPowers: false
      })
    }
  }

  React.useEffect(() => {
    getUser()
  }, [])

  async function logOut(e) {
    e.preventDefault()
    try{
      const logout = await AuthService.logout()
      if(!logout) throw Error("Something wen twrong with logging out")
      navigate("/login");
      window.location.reload();
      console.log("logged out", logout)
    } catch(err) {
      console.log("err", err)
    }


  }

  function toggle() {
    setUser(prev => {
      return {
        ...prev,
        modPowers: !prev.modPowers
      }
    })
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          {user.id && (
            <li className="nav-item">
              <Link to="/groups" className="nav-link">
                Groups
              </Link>
            </li>
          )}
          {user.isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Admin Board
              </Link>
            </li>
          )}
          {user.id && (
            <li className="nav-item">
              <Link to={`/user/${user.id}`} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>
        {user.id ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                {user.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
            <li className="nav-item nav-link new-post">
              <NewPost user={user} />
            </li>
            {user.isMod && <li>
              <div className="toggle-switch">
                <label>
                  <Switch onChange={toggle} checked={user.modPowers} />
                </label>
              </div>
            </li>}
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <span className="nav-link">
                <Login />
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link">
                <Register />
              </span>
            </li>
          </div>
        )}
      </nav>
      <div className="container mt-3">
        <Routes>
          {user.id && <Route path="/" element={<Home user={user}/>} />}
          <Route path="/home" element={<Home user={user}/>} />
          <Route path="/post/:id" element={<Post user={user} />} />
          <Route path="/register" element={<Register />} />
          {user.id && <Route path="/profile" element={<Profile user={user} />} />}
          <Route path="/user/:id" element={<BoardUser />} />
          {user.id && <Route path="/groups" element={<Groups user={user} />} />}
          {user.id && <Route path="/group/:id" element={<Group user={user} />} />}
          {user.id && <Route path="/admin" element={<BoardAdmin user={user} />} />}
          <Route path="/meme" element={<Meme />} />
        </Routes>
      </div>
    </div>
  )
}



// function App() {
//   return (
//     <div className="App">
//       <Header className="Header" />
//       <Meme />
//     </div>
//   );
// }
