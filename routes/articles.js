const express = require('express')
const Article = require('./../models/article');
const User = require('./../models/user');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article() })
})

router.get('/fillApplication', (req, res) => {
    res.render('articles/fillApplication', {user: new User()})
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article == null) {
        res.redirect('/')
    }
    res.render('articles/show', { article: article })
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


function saveArticleAndRedirect(path) {
    return async (req, res)  => {
        let article = req.article
            article.companyName = req.body.companyName
            article.jobTitle = req.body.jobTitle
            article.deadline = req.body.deadline
            article.stipend = req.body.stipend
            article.location = req.body.location
            article.duration = req.body.duration
            article.branches = req.body.branches
            article.formLink = req.body.formLink
            article.jobDescription = req.body.jobDescription
        //console.log(article)
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
            res.render(`articles/${path}`, { article: article}) //ensures prefilling in case of any errors
        }
    }
}

module.exports = router
