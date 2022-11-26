const express = require('express')
const User = require('../models/user');
const Article = require('../models/article');
const router = express.Router();


router.post('/', async (req, res) => {
    
    let user = new User({
        companyName: Article.companyName,
        userName: req.body.userName,
        rollNumber: req.body.rollNumber,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        cgpa: req.body.cgpa
    })
    try {
        user = await user.save()
        console.log(Article.jobTitle)
        console.log(`${user.userName} saved successfully`)
        res.redirect('/')
    } catch (e) {
        console.log(e.message)
        res.render('articles/fillApplication', {user: user})
    }
})

module.exports = router