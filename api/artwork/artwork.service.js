const dbService = require('../../services/db.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByEmail,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('artwork')
    if (filterBy.limit) {
        try {
            const artworks = await collection.find(criteria).limit(+filterBy.limit).collation({ locale: 'en' }).toArray();
            return artworks;
        } catch (err) {
            throw err;
        }
    } else {
        try {
            const artworks = await collection.find(criteria).collation({ locale: 'en' }).toArray();
            return artworks;
        } catch (err) {
            throw err;
        }
    }
}

async function getById(artworkId) {
    console.log("in getByID !!!!", artworkId)
    const collection = await dbService.getCollection('artwork')
    try {
        const artwork = await collection.findOne({ "_id": ObjectId(artworkId) })
        delete artwork.password
        artwork.givenReviews = await reviewService.query({ byartworkId: ObjectId(artwork._id) })
        artwork.givenReviews = artwork.givenReviews.map(review => {
            delete review.byartwork
            return review
        })
        return artwork

    } catch (err) {
        console.log(`ERROR: while finding artwork ${artworkId}`)
        throw err;
    }
}

async function getByEmail(email) {
    const collection = await dbService.getCollection('artwork')
    try {
        const artwork = await collection.findOne({ email })
        return artwork
    } catch (err) {
        console.log(`ERROR: while finding artwork ${email}`)
        throw err;
    }
}

async function remove(artworkId) {
    const collection = await dbService.getCollection('artwork')
    try {
        await collection.deleteOne({ "_id": ObjectId(artworkId) })
    } catch (err) {
        throw err;
    }
}

async function update(artwork) {
    const collection = await dbService.getCollection('artwork')
    artwork._id = ObjectId(artwork._id);
    try {
        await collection.replaceOne({ "_id": artwork._id }, { $set: artwork })
        return artwork
    } catch (err) {
        throw err;
    }
}

async function add(artwork) {
    console.log(" in artwork service !!! artwork added -" , artwork)
    const collection = await dbService.getCollection('artwork')
    try {
        await collection.insertOne(artwork);
        return artwork;
    } catch (err) {
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.title) {
        criteria.title = { $regex: filterBy.title, $options: '<m>' }
    }
    if (filterBy.minPrice) {
        criteria.price = { $gte: +filterBy.minPrice }
    }
    if (filterBy.maxPrice) {
        criteria.price = { $lt: +filterBy.maxPrice }
    }
    if (filterBy.creatorId) {
        criteria['createdBy._id'] = ObjectId(filterBy.creatorId)
    }
    if (filterBy.tag) {
        criteria.tags = { $in: [filterBy.tag] }
    }
    if (filterBy.colorTags) {
        console.log("building for colorTags !  ", filterBy.colorTags)
        criteria.colorTags = { $in: [filterBy.colorTags] }
    }

    if (filterBy.limit) {
    }
    if (filterBy.artType) {
        criteria.artType = filterBy.artType
    }
    if (filterBy.artGenre) {
        criteria.artGenre = filterBy.artGenre
    }
    if (filterBy.creatorName) {
        criteria['createdBy.fullName'] = { $regex: filterBy.creatorName, $options: '<m>' }
    }


    return criteria;
}