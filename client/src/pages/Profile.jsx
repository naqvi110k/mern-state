import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';
import { updateUserStart,updateUserSuccess,updateUserFailure,
  deleteUserStart,deleteUserSuccess,deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess
 } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from "react-router-dom"


const Profile = () => {
const {currentUser, loading } = useSelector((state) => state.user)
const fileRef = useRef(null)
const [file , setFile] = useState(undefined)
const [formData , setFormData] = useState({})
const dispatch = useDispatch();
const [userListings, setuserListings] = useState([])

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
      else {
      dispatch(updateUserFailure(error)) 
      toast.error("Error: " + error)
      }
    }
  };
  const handleDeleteUser = async () => {
    dispatch(deleteUserStart())
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`)
      dispatch(deleteUserSuccess())
      toast.success("User deleted successfully")
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message);
        dispatch(deleteUserFailure(error.response.data.message));
      }
      else {
      dispatch(deleteUserFailure(error)) 
      toast.error("Error: " + error)
      }
    }

  }
  const handleSignOut = async ()=>{
    dispatch(signOutUserStart())
   try {
    const response = await axios.get("/api/auth/signout");
    dispatch(signOutUserSuccess())
    toast.success("Signed out successfully")  
   } catch (error) {
    toast.error("Error: " + error) 
    dispatch(signOutUserFailure(error))
   }

  }

  const handleShowListing = async () => {
    try {
      const response = await axios.get(`/api/user/listings/${currentUser._id}`)
      if(response.data.length === 0) return toast.error("No listings found Please Create Listing")
      setuserListings(response.data)  
    } catch (error) {
      console.log(error);
      toast.error("Error: " + error.message)
    }
  } 

 const handleListingDelete = async (listingId) =>{
  try {
    const res = axios.delete(`/api/listing/delete/${listingId}`)
    toast.success("Listing deleted successfully")
     setuserListings((prev) => prev.filter((listing) => listing._id !== listingId))
  } catch (error) {
    console.log(error);
    toast.error("Error: " + error)
  }
 }


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

        <Link className='bg-green-700 text-white p-3
        rounded-lg text-center uppercase hover:opacity-95'  to ={"/create-listing"}>
        Create  Listing
        </Link>

      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser}
        className='text-red-700 cursor-pointer'> Delete account </span>
        <span onClick={handleSignOut}
        className='text-red-700 cursor-pointer'> Sign out </span>
      </div>
      <button onClick={handleShowListing}
       className='text-green-700 w-full pb-3'>
      Show Listings
      </button>
        {
          userListings && userListings.length >0 && 
          <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          { userListings.map((listing) => <div key={listing._id} 
          className="border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link
            to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} 
              className='h-16 w-16 object-contain' 
              alt="listing Cover" />
            </Link>
            <Link  
            className='text-slate-700 font-semibold
            flex-1 hover:underline truncate'
            to={`/listing/${listing._id}`}>
            <p > {listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
            <button onClick={() => handleListingDelete(listing._id)} 
            className='text-red-700 uppercase'>
            Delete
            </button>
            <Link to={`/update-listing/${listing._id}`}>
            <button className='text-green-700 uppercase'>
            edit
            </button>
            </Link>
            </div>
          </div>
        )}
          </div>
         
        } 

    </div>
    
  )
}

export default Profile