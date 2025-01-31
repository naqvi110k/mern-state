import bcrypt from "bcrypt";
import User from "../models/user.model.js";
export const  signup =  async(req,res,next) =>{
    
try {
    
    const { username, email, password } = req.body;


    // Validate request data
    if(!username ||!email ||!password){
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if(existingUser){
        return res.status(400).json({ message: 'Username already exists' });
    }


    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if(existingEmail){
        return res.status(400).json({ message: 'Email already exists' });
    }
 


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        // Return a success message
        res.status(201).json({ message: 'User created successfully' });
    

    
} catch (error) {
    next(error);
    
}
}
