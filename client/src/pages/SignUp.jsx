import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { OAuth } from '../Component/Oauth'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] =useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
   try {
    setLoading(true)
    //Send data to server
    await axios.post("/api/auth/signup", formData)
    .then(response =>{
      if (response.data){
        setLoading(false)
        setError(null)
        navigate("/sign-in")
        toast.success("Signed Up successfully! Please Login!");
      }
    })
    } catch (error) {
         if (error.response) {
          toast.error("Error: " + error.response.data.message);
          setLoading(false)
        }
      }

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        <input type="text" placeholder='username' className='border p-3 rounded-lg
        ' id = "username" onChange={handleChange}/>
         <input type="email" placeholder='Email' className='border p-3 rounded-lg
        ' id = "email"onChange={handleChange} />
         <input type="password" placeholder='password' className='border p-3 rounded-lg
        ' id = "password" onChange={handleChange}/>
        <button disabled={loading}
         className='bg-slate-700 text-white p-3 rounded-lg uppercase
         hover:opacity-95
         disabled:opacity-80
         '>
          {loading? "Loading..." : "Sign Up"}
         </button>
          <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to ="/sign-in">
        <span className=' text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignUp