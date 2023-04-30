const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async(req,res) =>{

    console.log(req.body);

    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered")
    }

    //hashed password;
    const hashedPassword = await bcrypt.hash(password,10);
    console.log('hashed password = ', hashedPassword);

    const user = await User.create({
        username: username,
        email: email,
        password: hashedPassword
    });

    console.log('user created ', user);

    if(user){
        res.status(201).json({
            _id: user._id,
            email: user.email
        })
    }
    else{
        res.status(400);
        throw new Error("user data is not valid")
    }
})

//@desc login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async(req,res) =>{

    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({email});  //response {username,email, pass, _id, createdAt, ...}
    // compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        // if this matches, we need to provide an access token in the response
        const accessToken = jwt.sign(
            {
                user:{
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "10m"}
        );
        
        res.status(200).json({ accessToken })
    }
    else{
        res.status(401);
        throw new Error("Password is not valid")
    }
    res.json({message: "login user"})
})

//@desc current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async(req,res) =>{
    res.json(req.user)
})

module.exports = {registerUser, loginUser, currentUser}