
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
    try {
        const artworks = await collection.find(criteria).collation({locale:'en'}).toArray();
        // const artworks = await collection.find({"createdBy._id" : ObjectId("5e7a44432f43d212c3800da5")}).collation({locale:'en'}).toArray();
        return artworks;
    } catch (err) {
        console.log('ERROR: cannot find artworks')
        throw err;
    }
}

async function getById(artworkId) {
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
        console.log(`ERROR: cannot remove artwork ${artworkId}`)
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
        console.log(`ERROR: cannot update artwork ${artwork._id}`)
        throw err;
    }

}

async function add(artwork) {
    const collection = await dbService.getCollection('artwork')
    try {
        await collection.insertOne(artwork);
        return artwork;
    } catch (err) {
        console.log(`ERROR: cannot insert artwork`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    console.log("the filterby: ",filterBy)
    const criteria = {};
    if (filterBy.title) {
        criteria.title =  { $regex: filterBy.title, $options: '<m>' } 
    }
    if (filterBy.minPrice) {
        criteria.minPrice = { $gte: +filterBy.minPrice }
    }
    if (filterBy.maxPrice) {
        criteria.maxPrice = { $lte: +filterBy.maxPrice }
    }
    if (filterBy.creatorId) {
        criteria['createdBy._id'] =  ObjectId(filterBy.creatorId)
    } 
    console.log("the crtieria: ",criteria)
    return criteria;
}

// {$regex:/<filterBy.title>/}
 