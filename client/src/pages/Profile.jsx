import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';
import { updateUserStart,updateUserSuccess,updateUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


const Profile = () => {
  const {currentUser, loading , error} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file , setFile] = useState(undefined)
const [formData , setFormData] = useState({})
const dispatch = useDispatch();
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    // Maximum file size (200KB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG, and PNG files are allowed.');
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset',import.meta.env.VITE_APP_PRESET);


 const API_URL = import.meta.env.VITE_APP_API_KEY;
  
    axios.post( API_URL,formData)
    .then(response => {
      console.log('File uploaded successfully:', response.data.secure_url);
      toast.success("Image uploaded successfully")
      setFormData({...formData, avatar: response.data.secure_url});
    })
    .catch(error => {
      console.error('Upload failed:', error);
      toast.error('Error uploading file');
    });
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart())
    try {
      const response = await axios.post(`/api/user/update/${currentUser._id}`, formData)
      dispatch(updateUserSuccess(response.data.rest))
      toast.success("Profile updated successfully")
      
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message);
        dispatch(updateUserFailure(error.response.data.message));
      }
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl  font font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <img src={formData.avatar || currentUser.avatar} alt="profile" onClick={()=>fileRef.current.click()}
         className=' mt-2 rounded-full h-24 w-24 object-cover 
        self-center cursor-pointer'/>
        <input onChange={(e)=> setFile(e.target.files[0])}
        type="file" ref={fileRef} hidden accept='image/*'/>
        <input 
        type="text"  defaultValue={currentUser.username}
        onChange={handleChange}
        placeholder='username' id='username'
        className='border p-3 rounded-lg '/>
        <input type="email" defaultValue={currentUser.email}
        onChange={handleChange}
         placeholder='email' id='email'
        className='border p-3 rounded-lg '/>
        <input type="password" placeholder='password' id='password' 
        onChange={handleChange}
        className='border p-3 rounded-lg'/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg
        uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...': "update"}
        </button>

      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'> Delete account </span>
        <span className='text-red-700 cursor-pointer'> Sign out </span>
      </div>
  
    </div>
    
  )
}

export default Profile