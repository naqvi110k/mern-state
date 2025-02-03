import axios from "axios";
import { useState } from "react"
import toast from "react-hot-toast";

export default function CreateListing (){
  const [files , setFiles] = useState([])
  const [upload , setUplaod] = useState(false)
  const  [formData, setFormData] =useState({
    imageUrls : [],
  })
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
  console.log(files)
  
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
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7"> Create a Listing</h1>
     <form className="flex flex-col sm:flex-row gap-4" >
     <div className="flex flex-col gap-4 flex-1">
     <input type="text" placeholder="Name" className="border p-3 
      rounded-lg" id="name" maxLength="62" minLength="10" required />
      <textarea type="text" placeholder="Description" className="border p-3 
      rounded-lg" id="description"required />
      <input type="text" placeholder="Address" className="border p-3 
      rounded-lg" id="address"  required />
      <div className="flex gap-6 flex-wrap">
        <div className="flex gap-2">
       <input type="checkbox" id="sale" className="w-5" />
       <span>Sell</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="type" className="w-5" />
       <span>Rent</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="parking" className="w-5" />
       <span>Parking spot</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="furnished" className="w-5" />
       <span>Furnished</span>
        </div>
        <div className="flex gap-2">
       <input type="checkbox" id="offer" className="w-5" />
       <span>Offer</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <input type="number" id="bedrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
          <p>Beds</p>
         </div>
        <div className="flex items-center gap-2">
          <input type="number" id="bathrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
          <p>Baths</p>
         </div>
        <div className="flex items-center gap-2">
          <input type="number" id="regularPrice" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
          <div className="flex flex-col items-center">
          <p>Regular price</p>
          <span className="text-xs">($/Month)</span>
          </div>
         </div>
        <div className="flex items-center gap-2">
          <input type="number" id="discountedPrice" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg" />
           <div className="flex flex-col items-center">
           <p>Discounted price</p>
          <span className="text-xs">($/Month)</span>
          </div>
         </div>
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
      <div  key={url} className="flex justify-between p-3 border items-center">
        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
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
     <button className="p-3  bg-slate-700 text-white rounded-lg uppercase
     hover:opacity-95 disabled:opacity-80">Create Listing</button>  
      </div>    
     </form>
    </main>
  )
}