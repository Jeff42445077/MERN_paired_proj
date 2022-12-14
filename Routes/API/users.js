const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load user Model from User.js
const User = require('../../models/User');

//@route GET api/users/test
//@desc Tests users route
//@access Public route
router.get('/test', () => (req, res)=> res.json({msg:"Users Works"})); //serve json

//@route GET api/users/register
//@desc Register
//@access Public
router.post('/register',(req, res)=> {
    User.findOne({ email: req.body.email  })
    .then(user => {
        if(user){
            return res.status(400).json({email: 'Email already exists'});
        }else{
            const avatar = gravatar.url(req.body.email,{
                s: '200', //Size
                r:'pg', //Rating
                d:'mm' //Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar, // installed gravatar for avatar functionality
                password: req.body.password
            });

            bcrypt.genSalt(10,(err,salt)=> {
                bcrypt.hash(newUser.password,salt,(err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });

        }
    });
});


//@route GET api/users/login
//@desc Login user/ Returning JWT Token
//@access Public
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    //Find user by email
    User.findOne({email})
    .then(user => {
    //Check user email
    if(!user){
        return res.status(404).json({email: 'User not found'});
    } 
    //check user password
    bcrypt.compare(password,user.password)
    .then(isMatch => {
        if(isMatch){//using jwt to verify
            // res.json({msg: 'Welcome' + user });

            //User matched
            //created JWT payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar, } // create jwt payload

            //Sign Token
            jwt.sign(
                payload, 
                keys.secretOrKey, 
                { expiresIn: 3600 }, 
                (err,token) => {
                    res.json({
                        success: true,
                        token:'Bearer ' + token
                    });
            });
        }else{
            return res.status(400).json({password: 'Incorrect Password'});
        }
    })
    });
})
module.exports = router;