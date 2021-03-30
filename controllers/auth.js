const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/user");
const expressJwt = require('express-jwt');
const Joi = require('@hapi/joi')


exports.signup = async (req, res) => {


    const schema = Joi.object({

        name: Joi.string().required().min(3),

        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        
        password: Joi.string().required().min(6)
    })

    const {error, value} = schema.validate(req.body);

    const{details:{message}} = error;
    if(error)
    {
        return res.status(400).json({

            error: message

        });
    }

    else
    {
        const userExists = await User.findOne({email: req.body.email})
        if(userExists) return res.status(403).json({

            error: "Email is already taken."
        });


        const user = await new User(req.body)
        await user.save();
        res.status(200).json({

            user: user
        });

    }
};

exports.signin = (req, res) => {

    //find the user based on email

    const {_id, email, password} = req.body
    User.findOne({email}, (err, user) => {

        //if error or no user

        if(err || !user){

            return res.status(401).json({

                error: "User with that email does not exist. Please sign in."
            })
        }

        //if user is found, authenticate
        
        if(!user.authenticate(password)){

            return res.status(401).json({

                error: "Email and Password do not match."
            })

        }

        //generate a token with user id and secret

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);


        //persist the token as 't' in cookie with expiry date

        res.cookie("t", token, {expire: new Date() + 9999});

        //return response with user and token to frontend client

        const {_id, name, email} = user;

        return res.json({token, user:{_id, email, name}});


    })

}
    

exports.signout = (req, res) =>
{
    res.clearCookie("t");
    return res.json({
                                                            
    message: "Sign Out success!"
    }); 
}
    

exports.requireSignIn = expressJwt(
    {
        secret: process.env.JWT_SECRET
    })

    
     
    


