import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

function MyDB() {
  const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017";
  console.log(mongoURL)
  const myDB = {};

  myDB.createUser = async function (user = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const users = client.db("Note").collection("users");
      const success = await users.findOne({ user: user.user });
      if (success) {
        return false;
      }
      await users.insertOne(user);
      return true;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.getUser = async function (user = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const users = client.db("Note").collection("users");
      const res = await users.findOne({ user: user.user });
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.deleteUser = async function (user = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const users = client.db('Note').collection('users');
      const res = await users.deleteOne({ user: user.user });
      return res;
    } finally {
      console.log('Note: db disconnected');
      client.close();
    }
  };

  myDB.updateProfile = async function (user = {}, profile = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      await client.connect();
      const users = client.db("Note").collection("users");
      const res = await users.updateOne(
        { user: user.user },
        {
          $set: {
            school: profile.school,
            major: profile.major,
            profilePicture: profile.profilePicture,
          },
        },
      );
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.authenticate = async function (user = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const users = client.db("Note").collection("users");
      const userInDb = await users.findOne({ user: user.user });
      if (!userInDb) {
        return false;
      }
      return userInDb.password == user.password;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.createNote = async function (entry = {}, user = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const notes = client.db("Note").collection("notes");
      const res = await notes.insertOne({
        author: user.user,
        title: entry.title,
        course: entry.course,
        content: entry.content,
      });
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.listNotes = async function (user = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const notes = client.db("Note").collection("notes");
      const res = await notes.find({ author: user.user }).toArray();
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.getNote = async function (id = "") {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const notes = client.db("Note").collection("notes");
      const res = await notes.findOne({ _id: ObjectId(id) });
      console.log(res);
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.editNote = async function (id = "", entry = {}) {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const notes = client.db("Note").collection("notes");
      const res = await notes.updateOne(
        { _id: ObjectId(id) },
        { $set: { 
          course: entry.course, 
          content: entry.content } },
      );
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  myDB.deleteNote = async function (id = "") {
    let client;
    try {
      client = new MongoClient(mongoURL);
      const notes = client.db("Note").collection("notes");
      const res = await notes.deleteOne({ _id: ObjectId(id) });
      return res;
    } finally {
      console.log("Note: db disconnected");
      client.close();
    }
  };

  return myDB;
}

export default MyDB();
