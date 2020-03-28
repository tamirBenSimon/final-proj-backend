const express = require('express')
const { addWishlist, getWishlist, deleteWishlist } = require('./wishlist.controller')
const router = express.Router()


router.get('/:id', getWishlist)
router.put('/:id', addWishlist)
router.delete('/:id', deleteWishlist)

module.exports = router