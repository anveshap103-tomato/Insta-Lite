const express = require('express');
const Prisma = require("../db");
const router = express.Router();


router.get('/users', async(req, res) => {
  const all_users = await Prisma.user.findMany();
  res.status(200).json(all_users);
})

router.post('/users', async(req, res) => {
  const {username, email, fullname, bio} = req.body;
  if (!username || !email || !fullname){
    res.status(400).json({ "error": "username, email and fullname are required" });
    return;
  }

  const already_exist = await Prisma.user.findUnique({
    where: { email: email , username: username},
  })

  if (already_exist) {
    res.status(409).json({ "error": "username or email already taken" });    
  }else{
    const new_user = await Prisma.user.create({
      data: {
        username: username,
        email: email,
        fullname: fullname,
        bio: bio
      }
    })
    res.status(201).json(new_user);
  }

})

router.get('/user/:id', async (req, res) => {
  const user = await Prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  })

  if (user) {
    res.status(200).json(user);
  }else{
    res.status(404).json({ "error": "User not found" });
  }
})

router.patch('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { fullname, bio, isPrivate } = req.body;

  const user = await Prisma.user.findUnique({
    where: { id: id }
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const updated_user = await Prisma.user.update({
    where: { id: id },
    data: {
      ...(fullname !== undefined && { fullname }),
      ...(bio !== undefined && { bio }),
      ...(isPrivate !== undefined && { isPrivate })
    }
  });

  res.status(200).json(updated_user);
});

router.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id);

  const user = await Prisma.user.findUnique({
    where: { id: id }
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await Prisma.user.delete({
    where: { id: id }
  });

  res.status(204).send();
});


module.exports = router;