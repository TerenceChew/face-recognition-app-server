const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '84fcb6f951cb40e9a13a0d3acb980eee'
 });

const handleClarifaiApiCall = (req, res) => {
  const { input } = req.body;
  app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
  .then(response => res.json(response))
  .catch(err => res.status(400).json('could not connect to clarifai'))
}

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
  .where({id})
  .increment('entries', 1)
  .returning('entries')
  .then(entries => res.json(entries[0].entries))
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleClarifaiApiCall,
  handleImage
}