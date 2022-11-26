const express = require('express')
const Article = require('./../models/article');
const User = require('./../models/user');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article() })
})

router.get('/fillApplication/:id', async (req, res) => {
    console.log('entered')
    try {
        console.log('trying')
        const article = await Article.findById(req.params.id)
        if(article == null) {
            res.redirect('/')
        }
        res.render('articles/fillApplication', {user: new User(), companyName: article.companyName, jobTitle: article.jobTitle})
    } catch(err) {
        console.log(err)
    }
    
})

router.get('/sort', async (req, res) => {
    try {
        const page = parseInt(req.query.page) -1|| 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        let sort = req.query.sort || "stipend";
        let location = req.query.location || "All";

        console.log("1")
        const locationOptions = [
            "Bangalore",
            "Hyderabad",
            "Gurgaon",
            "Hyderabad",
            "Delhi",
            "Noida",
            "Mumbai",
            "Pune",
            "Gujarat"
        ];

        console.log("2")
        location == "All" 
            ? (location = [...locationOptions])
            : (location = req.query.location.split(","));
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        console.log("3")
        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = 'asc';
        }

        console.log("4")
        const jobs = await Article.find({jobTitle: {$regex: search, $options: "i"}})
            .where("location")
            .in([...location])
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

            console.log("5")
        const total = await Article.countDocuments({
            location: {$in: [...location]},
            jobTitle: {$regex: search, $options: "i"}
        });

        console.log("6")
        const response = {
            error: false,
            total,
            page: page+1,
            limit,
            location: locationOptions,
            jobs
        };

        res.send(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: true, message: "Filtering Error"});
    }
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
