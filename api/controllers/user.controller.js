    import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
    
    export const updateUser = async (req, res, next) => {
        if (req.user.id !== req.params.id) {
            return res.status(401).json({ message: 'You can only update you account' });
        } 
        try {

            if (req.body.password){
             req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar : req.body.avatar

                }
            }, {new: true})

        const {password, ...rest} = updatedUser._doc
       res.status(200).json({ message: 'User updated successfully', rest });
        } catch (error) {
            next(error);   
        }


    }

   export const deleteUser = async (req, res,next) => {
    if (req.user.id!== req.params.id) {
            return res.status(401).json({ message: 'You can only delete your account' });
        }
       try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("acess_token");
        res.status(200).json({ message: 'User deleted successfully' })
        
       } catch (error) {
        next(error);
         } 

   } 

   export const getUserListings = async (req, res,next) => {
    if(req.user.id === req.params.id){
      try {
        const listing = await Listing.find({useRef :req.params.id})
        res.status(200).json(listing)  
      } catch (error) {
        next(error);  
      }


    }
    else {
        return res.status(401).json({message: "you can only view your own listings"})
    }
   }
