const express = require('express')
const Article = require('./../models/article')
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article() })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article == null) {
        res.redirect('/')
    }
    res.render('articles/show', { article: article })
})

router.post('/', async (req, res) => {
    let article = new Article({
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        deadline: req.body.deadline,
        stipend: req.body.stipend,
        location: req.body.location,
        duration: req.body.duration,
        branches: req.body.branches,
        formLink: req.body.formLink,
        jobDescription: req.body.jobDescription
    })
    console.log(article)
    try {
        article = await article.save()
        //res.send("Success!")
        res.redirect(`/articles/${article.slug}`)
        console.log('rediredcted to ${article.slug}')
        // res.redirect(`./articles/${article._id}`)
    }
    catch (e) {
        console.log('Error',e.message)
        console.log(e.stack)
        res.render('articles/new', { article: article}) //ensures prefilling in case of any errors
    }
    
})


router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports = router
