import Listing from "../models/listing.model.js";

export const createListing = async (req,res,next) =>{
    try {
    const listing = await Listing.create(req.body);
    res.status(201).json({message: "Listing created successfully", listing});
    } catch (error) {
        next(error);   
    }

}

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if(req.user.id !== listing.useRef) {
    return res.status(403).json({ message: "You can only delete your own listing" });
  }
  try {
    await Listing.findByIdAndDelete(req.params.id)
   res.status(200).json({ message: "Listing deleted successfully" });   
  } catch (error) {
    next(error);
  }
}