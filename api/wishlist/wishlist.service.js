const dbService = require('../../services/db.service')
    // const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    add,
    remove,
    // getById,
}

async function query(userId) {
    console.log('userId123: ', userId);
    const collection = await dbService.getCollection('user')
    try {
        const wishlist = await collection.find({ "_id": ObjectId(userId) }).toArray();
        console.log('wishlist123: ', wishlist);
        return wishlist
    } catch (err) {
        console.log('ERROR: cannot find wishlist')
        throw err;
    }
}

// async function getById(userId) {
//     const collection = await dbService.getCollection('user')
//     try {
//         const user = await collection.findOne({"_id":ObjectId(userId)})
//         delete user.password

//         user.givenReviews = await reviewService.query({byUserId: ObjectId(user._id) })
//         user.givenReviews = user.givenReviews.map(review => {
//             delete review.byUser
//             return review
//         })

async function remove(userId, productId) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.updateOne({ "_id": ObjectId(userId) }, { $pull: { "wishlist": { "_id": productId } } }, false, true)
    } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        throw err;
    }
}



async function add(userId, product) {
    const collection = await dbService.getCollection('user')
    try {
        collection.replaceOne({ "_id": ObjectId(`${userId}`) }, { $push: { "wishlist": product } });
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}