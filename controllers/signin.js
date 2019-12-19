const handleSignin = (db, bcrypt) => (req, res) => {
  // bcrypt.compare(
  //   "apple",
  //   "$2b$10$Eu5OOaABgaZxUrFL2D1nHObJ7CijKwS.sdyPGNvlUBX6w88SVd0YO",
  //   function(err, res) {
  //     console.log("first guess", res);
  //   }
  // );
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form data");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get the user"));
      } else {
        res.status(400).json("Wrong crediential");
      }
    })
    .catch(err => res.status(400).json("Wrong crediential"));
};

module.exports = {
  handleSignin: handleSignin
};
