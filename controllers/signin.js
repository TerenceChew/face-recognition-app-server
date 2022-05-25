const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json('missing form field(s)');
    return;
  }
  db.select('email', 'hash').from('login')
  .where({email})
  .then(result => {
    const isValid = bcrypt.compareSync(password, result[0].hash);
    if (isValid) {
      db.select('*').from('users')
      .where({email})
      .then(user => res.json(user[0]))
    } else {
      res.status(400).json('username and password do not match')
    }
  })
  .catch(err => res.status(400).json('failed to sign in'))
}

module.exports = {
  handleSignin
}