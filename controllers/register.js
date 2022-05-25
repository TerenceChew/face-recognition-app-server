const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json('missing form field(s)');
    return;
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      email,
      hash
    })
    .into('login')
    .then(result => {
      trx.insert({
        name,
        email,
        joined: new Date()
      })
      .into('users')
      .returning('*')
      .then(user => res.json(user[0]))
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister
}