const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    add,
    remove,
}

async function query(userId) {
    const collection = await dbService.getCollection('user')
    try {
        const wishlist = await collection.find({ "_id": ObjectId(userId) }).toArray();
        return wishlist
    } catch (err) {
        console.log('ERROR: cannot find wishlist')
        throw err;
    }
}

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