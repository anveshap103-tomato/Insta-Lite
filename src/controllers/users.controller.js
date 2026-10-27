const {
    createUser,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUNique
} = require('../services/users.service');

const create = (req, res) => {
  const {username, email, fullname, bio} = req.body;
  if (!username || !email || !fullname){
    res.status(400).json({ "error": "username, email and fullname are required" });
    return;
  }

  const already_exist = getUNique(email, username);

  if (already_exist) {
    res.status(409).json({ "error": "username or email already taken" });    
  }else{
    const new_user = createUser({
        username: username,
        email: email,
        fullname: fullname,
        bio: bio
      })
    res.status(201).json(new_user);
  }

};

const list = (req, res) => {
    const all_users = listUsers();
    res.status(200).json(all_users);
};

const getOne = (req, res) => {
    const id = parseInt(req.params.id)
    const user = getUserById(id)
    
      if (user) {
        res.status(200).json(user);
      }else{
        res.status(404).json({ "error": "User not found" });
      }

}

const update = (req, res) => {
    const id = parseInt(req.params.id);
      const { fullname, bio, isPrivate } = req.body;
    
      const user = getUserById(id)
    
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    
      const updated_user = updateUser(id, {
          ...(fullname !== undefined && { fullname }),
          ...(bio !== undefined && { bio }),
          ...(isPrivate !== undefined && { isPrivate })
        })
    
      res.status(200).json(updated_user);

}

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    
      const user = getUNique(id)
    
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    
      deleteUser(id)
    
      res.status(204).send();
}

module.exports = {
    create,
    list,
    getOne,
    update,
    remove
}