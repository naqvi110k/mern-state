import React from 'react'
import {BrowserRouter, Routes , Route} from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Header from './Component/Header'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './Component/PrivateRoute'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route element={<PrivateRoute />} >
      <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
    <Toaster/>
    </BrowserRouter>
  )
}

export default App
