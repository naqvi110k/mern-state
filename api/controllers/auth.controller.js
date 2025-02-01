import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const  signup =  async(req,res,next) =>{
    
try {
    
    const { username, email, password } = req.body;


    // Validate request data
    if(!username ||!email ||!password){
        return res.status(500).json({ message: 'All fields are required' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if(existingUser){
        return res.status(500).json({ message: 'Username already exists' });
    }


    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if(existingEmail){
        return res.status(500).json({ message: 'Email already exists' });
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

export const signin = async (req, res, next) => {
    const {email , password} = req.body;

    try {
        // Validate request data
        if(!email ||!password){
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }   

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.cookie("acess-token", token, {
            httpOnly: true

        }) 
         const {password: pass , ...rest} = user._doc
        res.json({ message: 'User authenticated successfully', rest});





        
        
    } catch (error) {
        next(error);
    }
}