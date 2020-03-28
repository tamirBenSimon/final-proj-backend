const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    console.log('inside orderService query. filterBy is:',filterBy)
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('order')
    try {
        const orders = await collection.find(criteria).collation({ locale: 'en' }).toArray();
        // const orders = await collection.find({"createdBy._id" : ObjectId("5e7a44432f43d212c3800da5")}).collation({locale:'en'}).toArray();
        return orders;
    } catch (err) {
        console.log('ERROR: cannot find orders')
        throw err;
    }
}

async function getById(orderId) {
    const collection = await dbService.getCollection('order')
    try {
        const order = await collection.findOne({ "_id": ObjectId(orderId) })
        delete order.password

        order.givenReviews = await reviewService.query({ byorderId: ObjectId(order._id) })
        order.givenReviews = order.givenReviews.map(review => {
            delete review.byorder
            return review
        })
        return order
    } catch (err) {
        console.log(`ERROR: while finding order ${orderId}`)
        throw err;
    }
}

async function remove(orderId) {
    const collection = await dbService.getCollection('order')
    try {
        await collection.deleteOne({ "_id": ObjectId(orderId) })
    } catch (err) {
        console.log(`ERROR: cannot remove order ${orderId}`)
        throw err;
    }
}

async function update(order) {

    const collection = await dbService.getCollection('order')
    order._id = ObjectId(order._id);

    try {
        await collection.replaceOne({ "_id": order._id }, { $set: order })
        return order
    } catch (err) {
        console.log(`ERROR: cannot update order ${order._id}`)
        throw err;
    }

}

async function add(order) {
    const collection = await dbService.getCollection('order')
    
    order.by._id = ObjectId(order.by._id);
    order.from._id = ObjectId(order.from._id);
    order.product._id = ObjectId(order.product._id);
    console.log('inside add: ',order);
    try {
        await collection.insertOne(order);
        return order;
    } catch (err) {
        console.log(`ERROR: cannot insert order`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.title) {
        criteria.title = { $regex: filterBy.title, $options: '<m>' }
    }
    if (filterBy.minPrice) {
        criteria.minPrice = { $gte: +filterBy.minPrice }
    }
    if (filterBy.maxPrice) {
        criteria.maxPrice = { $lte: +filterBy.maxPrice }
    }
    if (filterBy.sellerId) {
        console.log("the filterby: ", filterBy.sellerId)
        criteria['from._id'] = ObjectId(filterBy.sellerId)
        // criteria['from._id'] = filterBy.sellerId
    }

    return criteria;
}

// {$regex:/<filterBy.title>/}