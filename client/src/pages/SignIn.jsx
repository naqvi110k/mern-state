import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import {signInStart, signInSuccess, signInFailure} from "../redux/user/userSlice"

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const response = await axios.post("/api/auth/signin", formData);
      dispatch(signInSuccess(response.data)); // Pass user data to Redux
      navigate("/");
      toast.success("Signed in successfully!");
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message);
        dispatch(signInFailure(error.response.data.message));
      }
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
         <input type="email" placeholder='Email' className='border p-3 rounded-lg
        ' id = "email"onChange={handleChange} />
         <input type="password" placeholder='password' className='border p-3 rounded-lg
        ' id = "password" onChange={handleChange}/>
        <button disabled={loading}
         className='bg-slate-700 text-white p-3 rounded-lg uppercase
         hover:opacity-95
         disabled:opacity-80
         '>
          {loading? "Loading..." : "Sign in"}
         </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Donot have an account?</p>
        <Link to ="/sign-up">
        <span className=' text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignIn