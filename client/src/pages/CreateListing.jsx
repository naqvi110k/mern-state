import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing (){
  const {currentUser} = useSelector(state => state.user)
  const [files , setFiles] = useState([])
  const [upload , setUplaod] = useState(false)
  const [loading, setLaoding] = useState(false)
  const navigate = useNavigate()
  const  [formData, setFormData] =useState({
    imageUrls : [],
    name : "",
    description : "",
    address : "",
    type : "rent",
    regularPrice : 50,
    discountedPrice : 0,
    bathrooms : 1,
    bedrooms : 1,
    offer : false,
    parking : false,
    furnished : false,
    useRef : currentUser._id,
  })
  console.log(formData);
  
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7 ) {
      setUplaod(true)
      const promises =[];
      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageUrls : formData.imageUrls.concat(urls)});
        setUplaod(false)
        setFiles([])
      }).catch((err) => {
        toast.error('Error uploading images',err);
        setUplaod(false)
      });

    } else {
      toast.error('You can only upload a maximum of 6 images');
    }
  }
  
  const uploadImage = async (file) => {
    return new Promise((resolve,reject) =>{

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      // Maximum file size (200KB)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, JPG, and PNG files are allowed.');
        setUplaod(false);
        return;
      }
  
      // Check file size
      if (file.size > maxSize) {
        toast.error('File size must be less than 2MB.');
        setUplaod(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset',import.meta.env.VITE_APP_PRESET);
  
  
   const API_URL = import.meta.env.VITE_APP_API_KEY;
    
      axios.post( API_URL,formData)
      .then(response => {
        toast.success("Uploaded Image : " + response.data.display_name);
       resolve(response.data.secure_url)
      })
      .catch(error => {
        toast.error('Error uploading file');
        reject(error);
      });
    })
  }

const handleImageDelete = (index) =>{
    setFormData({...formData,
     imageUrls: formData.imageUrls.filter((_,i) => i !== index)
     })  

    }
  const handleChange = (e)=>{
    if (e.target.id == "sale" || e.target.id == "rent"){
      setFormData({
      ...formData,
       type: e.target.id
      })   
    }
  if (e.target.id == "offer" || e.target.id == "parking" || e.target.id == "furnished"){
    setFormData({
     ...formData,
      [e.target.id]: e.target.checked
    })
  }
 if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
   setFormData({
    ...formData,
     [e.target.id]: e.target.value
   })
 }
 }
  const handleSubmit = async (e)  => {
    e.preventDefault();
    try {
      if(formData.imageUrls ==0) return toast.error("you have to submit at least one image");
      if (+formData.discountedPrice > +formData.regularPrice) return toast.error("Discounted price must be lower than regular price")
     setLaoding(true);
    const response = await  axios.post("/api/listing/create", formData)
    toast.success(response.data.message);
    setLaoding(false);
    navigate(`/listing/${response.data.listing._id}`) 
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      setLaoding(false); 
    }

  }  
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7"> Create a Listing</h1>
     <form  onSubmit={handleSubmit}
     className="flex flex-col sm:flex-row gap-4" >
     <div className="flex flex-col gap-4 flex-1">
     <input
      type="text" placeholder="Name" 
      className="border p-3 
      rounded-lg" 
      id="name"
       maxLength="62" 
       minLength="10" 
       required 
       onChange={handleChange}
       value={formData.name}
       />
      <textarea 
      type="text" 
      placeholder="Description" 
      className="border p-3 rounded-lg"
       id="description"
       required
       onChange={handleChange}
       value={formData.description}
       />
      <input 
      type="text" 
      placeholder="Address"
       className="border p-3 rounded-lg"
        id="address"
        required 
        onChange={handleChange}
        value={formData.address}
        />
      <div className="flex gap-6 flex-wrap">
        <div className="flex gap-2">
       <input type="checkbox" id="sale" className="w-5" 
       onChange={handleChange} 
       checked={formData.type === 'sale'}
       />
       <span>Sell</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="rent" className="w-5"
       onChange={handleChange}
       checked={formData.type === 'rent'}
       />
       <span>Rent</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="parking" className="w-5" 
       onChange={handleChange}
       checked={formData.parking}
       />
       <span>Parking spot</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="furnished" className="w-5"
       onChange={handleChange}
       checked={formData.furnished}
       />
       <span>Furnished</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="offer" className="w-5"
       onChange={handleChange}
       checked={formData.offer}
       />
       <span>Offer</span>
      </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <input type="number" 
          id="bedrooms"
           min="1" max="10" 
          required 
          className="p-3 border border-gray-300 rounded-lg" 
           onChange={handleChange}
           value={formData.bedrooms}
           />
          <p>Beds</p>
         </div>
        <div className="flex items-center gap-2">
          <input type="number"
           id="bathrooms"
            min="1" max="10"
            required
            className="p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.bathrooms}
             />
          <p>Baths</p>
         </div>
        <div className="flex items-center gap-2">
          <input type="number" 
          min="50"
          max="10000000"
          id="regularPrice" 
           required
            className="p-3 border border-gray-300 rounded-lg" 
            onChange={handleChange}
            value={formData.regularPrice}
            />
          <div className="flex flex-col items-center">
          <p>Regular price</p>
          <span className="text-xs">($/Month)</span>
          </div>
         </div>
      {formData.offer &&
       <div className="flex items-center gap-2">
       <input type="number" 
       min="0"
       max="10000000"
       id="discountedPrice" 
        required 
        className="p-3 border border-gray-300 rounded-lg" 
        onChange={handleChange}
        value={formData.discountedPrice}
        />
        <div className="flex flex-col items-center">
        <p>Discounted price</p>
       <span className="text-xs">($/Month)</span>
       </div>
      </div>
      }
      </div>
     </div> 
     <div className="flex flex-col flex-1 gap-4">
     <p className="font-semibold">Images:
     <span className="font-normal text-gray-600 ml-2"> The first images will be the cover (max 6)</span>
     </p>
     <div className="flex gap-4">
      <input onChange={(e)=> setFiles(e.target.files)} 
       className="p-3 border border-gray-300 rounded w-full"  type="file" id="images/*" multiple />
      <button disabled={upload} type="button" onClick={handleImageSubmit}
      className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg 
      disabled:opacity-80">
         {upload? 'Uploading...' : 'Upload'}
      </button>
     </div>
     {
      formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
      <div   className="flex justify-between p-3 border items-center">
        <img key={url}
        src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
        <p>
          {
            formData.imageUrls.indexOf(url) === 0? 'Image 1' : `Image ${formData.imageUrls.indexOf(url) + 1}`
          }
        </p>
        <button onClick={() => handleImageDelete(index)}
        type="button" className="p-3 text-red-700
        rounded-lg uppercase hover:opacity-75">Delete</button>
        </div>
   
      ))
     }
     <button disabled={loading ||upload} className="p-3  bg-slate-700 text-white rounded-lg uppercase
     hover:opacity-95 disabled:opacity-80">
      {
        loading? 'Creating Listing...' : 'Create Listing'
      }
      </button>  
      </div>    
     </form>
    </main>
  )
}