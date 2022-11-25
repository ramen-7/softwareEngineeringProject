
const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')

const articleSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    stipend: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    branches: {
        type: String,
        required: true
    },
    formLink: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

//every single time we save, update, create, delete
articleSchema.pre('validate', function(next) {
    if(this.companyName) {
        this.slug = slugify(this.companyName, {lower: true, strict: true })
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)