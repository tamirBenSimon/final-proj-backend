const wishlistService = require('./wishlist.service')

// async function getUser(req, res) {
//     const user = await wishlistService.getById(req.params.id)
//     res.send(user)
// }

async function getWishlist(req, res) {
    const userId = req.params.id;
    const wishlist = await wishlistService.query(userId)
    res.send(wishlist)
}

async function deleteWishlist(req, res) {
    const { productId, userId } = req.body;
    await wishlistService.remove(userId, productId)
    res.end()
}

async function addWishlist(req, res) {
    const product = req.body;
    const userId = req.params.id;
    await wishlistService.add(userId, product)
    res.end()
}

module.exports = {
    getWishlist,
    addWishlist,
    deleteWishlist,
    // getUsers
}