const artworkService = require('./artwork.service')

async function getartwork(req, res) {
    const artwork = await artworkService.getById(req.params.id)
    res.send(artwork)
}
  
async function getartworks(req, res) {
    console.log(req.query);
    const artworks = await artworkService.query(req.query)
    res.send(artworks)
}

async function deleteartwork(req, res) {
    await artworkService.remove(req.params.id)
    res.end()
}

async function updateartwork(req, res) {
    const artwork = req.body;
    await artworkService.update(artwork)
    res.send(artwork)
}

module.exports = {
    getartwork,
    getartworks,
    deleteartwork,
    updateartwork
}