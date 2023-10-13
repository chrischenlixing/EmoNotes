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
  try {
    const success = await myDB.authenticate(user);
    if (success) {
      req.session.user = { user: user.user };
      res.json({ isLoggedIn: true, err: null });
    } else {
      req.session.user = null;
      res.json({ isLoggedIn: false, err: "Your Email or Password is incorrect" });
    }
  } catch (error) {
    console.error("Database error in /authenticate:", error);
    res.status(500).json({ isLoggedIn: false, err: "Database error" });
  }
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.json({ isLoggedIn: false, msg: "You have successfully logged" });
});

router.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    const success = await myDB.createUser(user);
    if (!success) {
      res.json({ isLoggedIn: false, err: "User already exists" });
      return;
    }
    req.session.user = { user: user.user };
    res.json({ isLoggedIn: true, err: null });
  } catch (error) {
    console.error("Database error in /signup:", error);
    res.status(500).json({ isLoggedIn: false, err: "Database error" });
  }
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
  try {
    const sortOrder = req.query.sortOrder;
    const notes = await myDB.listNotes(req.session.user);

    if (sortOrder === "ascending") {
      notes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "descending") {
      notes.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      notes.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.json(notes);
  } catch (error) {
    console.error("Error listing notes:", error);
    res.status(500).json({ error: "An error occurred while listing the notes" });
  }
});

router.post("/createNote", async (req, res) => {
  console.log("createNote");
  console.log(req.body);
  await myDB.createNote(req.body, req.session.user);
  res.json({ msg: "Note Saved" });
});

router.post("/editNote", async (req, res) => {
  try {
    console.log("updateNote");
    await myDB.editNote(req.query.id, req.body);
    res.json({ msg: "Note Updated" });
  } catch (error) {
    console.error("Error editing note:", error);
    res.status(500).json({ error: "An error occurred while editing the note" });
  }
});

router.get("/deleteNote", async (req, res) => {
  try {
    console.log("deleteNote");
    console.log(req.query.id);
    await myDB.deleteNote(req.query.id);
    res.json({ msg: "Note Deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "An error occurred while deleting the note" });
  }
});

router.get("/getNote", async (req, res) => {
  try {
    console.log("getNote");
    console.log(req.query.id);
    const note = await myDB.getNote(req.query.id);
    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "An error occurred while fetching the note" });
  }
});

export default router;
