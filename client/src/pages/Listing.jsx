import { useEffect, useState } from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import {Swiper,SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import "swiper/css/bundle"

const Listing = () => {
    SwiperCore.use([Navigation])
   const [listing, setListing] = useState(null) 
   const [loading,setLoading] = useState(false)
    const [error, setError] = useState(false)  
 const params = useParams()
    useEffect(() =>{
        const fetchListing = async() =>{
       try {
        setLoading(true)
        const res =await axios.get(`/api/listing/get/${params.listingId}`)
        setListing(res.data)
        setLoading(false)
        setError(false) // set error state to false when data is fetched successfully
           
       } catch (error) {
        toast.error("Error: " + error)  // display error message if any error occurs during fetching data
        setLoading(false)
        setError(true) // set error state to true when an error occurs
       }
       }
        fetchListing()
    },[])
    
  return (
    <main>
        {
            loading && <p className="text-center my-7 
            text-2xl">
         Loading... </p>
        }
        { error && <p className="text-center my-7 
         text-2xl">
         Something Went Wrong! </p>
        }
      {
        listing && !error && !loading &&(
            <Swiper navigation>
             {listing.imageUrls.map((url) =>(
                <SwiperSlide key={url}>
                    <div
                    className="h-[550px]"
                    style={{background : `url(${url})
                    center no-repeat`, backgroundSize:"cover"
                 }}
                    ></div>
                </SwiperSlide>
             ))}
            </Swiper>
        )
      }  
    </main>
  )
}

export default Listing