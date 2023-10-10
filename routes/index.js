import express from "express";
import myDB from "../db/MyDB.js";

const router = express.Router();

router.get("/getCurrentUser", (req, res) => {
  console.log("getCurrentUser", req.session);
  res.json({
    isLoggedIn: !!req.session.user,
    user: req.session.user,
  });
});

router.post("/authenticate", async (req, res) => {
  const user = req.body;
  const success = await myDB.authenticate(user);
  if (success) {
    req.session.user = { user: user.user };
    res.json({ isLoggedIn: true, err: null });
  } else {
    req.session.user = null;
    res.json({ isLoggedIn: false, err: "Your Email or Password is incorrect" });
  }
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.json({ isLoggedIn: false, msg: "You have successfully logged" });
});

router.post("/signup", async (req, res) => {
  const user = req.body;
  const success = await myDB.createUser(user);
  if (!success) {
    res.json({ isLoggedIn: false, err: "User already exists" });
    return;
  }
  req.session.user = { user: user.user };
  res.json({ isLoggedIn: true, err: null });
});

router.get("/getUser", async (req, res) => {
  console.log("getUser");
  console.log(req);
  const user = await myDB.getUser(req.session.user);
  res.json(user);
});

router.post("/updateProfile", async (req, res) => {
  console.log("updateProfile");
  console.log(req.body);
  await myDB.updateProfile(req.session.user, req.body);
  res.json({ msg: "Profile Updated" });
});

router.get("/listNotes", async (req, res) => {
  const notes = await myDB.listNotes(req.session.user);
  res.json(notes);
});

router.post("/createNote", async (req, res) => {
  console.log("createNote");
  console.log(req.body);
  await myDB.createNote(req.body, req.session.user);
  res.json({ msg: "Note Saved" });
});

router.post("/editNote", async (req, res) => {
  console.log("updateNote");
  await myDB.editNote(req.query.id, req.body);
  res.json({ msg: "Note Updated" });
});

router.get("/deleteNote", async (req, res) => {
  console.log("deleteNote");
  console.log(req.query.id);
  await myDB.deleteNote(req.query.id);
  res.json({ msg: "Note Deleted" });
});

router.get("/getNote", async (req, res) => {
  console.log("getNote");
  console.log(req.query.id);
  const note = await myDB.getNote(req.query.id);
  res.json(note);
});

export default router;
