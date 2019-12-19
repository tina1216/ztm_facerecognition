const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form data");
  }
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("Unable to register"));
};

module.exports = {
  handleRegister: handleRegister
};

//2
//   bcrypt.hash(password, function(err, hash) {
//     // Store hash in your password DB.
//     db.transaction(trx => {
//       trx
//         .insert({
//           hash: hash,
//           email: email
//         })
//         .into("login")
//         .returning("email")
//         .then(loginEmail => {
//           return trx("users")
//             .returning("*")
//             .insert({
//               name: name,
//               email: loginEmail[0],
//               joined: new Date()
//             })
//             .then(user => {
//               res.json(user[0]);
//             });
//         })
//         .then(trx.commit)
//         .catch(trx.rollback);
//     }).catch(err => res.status(400).json("Unable to register"));
//   });
// });
