const Card = require('../models/card.js');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        res.status(404).send('Карточка с таким id не найдена');
        return;
      }
      if (String(card.owner) !== _id) {
        Card.findByIdAndRemove(cardId)
        return Promise.reject(new Error('Можно удалять только свои карточки'));
      } else {
          .then((data) => res.send(data))
          .catch((err) => res.status(500).send({ message: err.message }));
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((like) => res.send({ data: like }))
  .catch((err) => res.status(404).send({ message: err.message }));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((like) => res.send({ data: like }))
  .catch((err) => res.status(404).send({ message: err.message }));
