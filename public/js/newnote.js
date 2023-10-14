function NewNote() {
  const newNote = {};
  const divMsg = document.querySelector("div#msg");

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  newNote.getCurrentUser = async function () {
    let res;
    try {
      res = await fetch("./getCurrentUser");
      const resUser = await res.json();
      if (!resUser.isLoggedIn) {
        redirect("login");
      } 
    } catch (err) {
      console.log(err);
    }
  };

  newNote.setupLogout = function () {
    const linkLogout = document.querySelector("#linkLogout");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("loggedout");
      res = await fetch("/logout");
      const resLogout = await res.json();
      showMessage(resLogout.msg);
      setTimeout(() => redirect("/login"), 1000);
    });
  };

  newNote.setupSave = function () {
    const form = document.querySelector("form#newnote");
    const linkLogout = document.getElementById("save");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      res = await fetch("./createNote", {
        method: "POST",
        body: new URLSearchParams(new FormData(form)),
      });
      const response = await res.json();
      showMessage(response.msg);
      setTimeout(() => redirect("/index"), 1000);
    });
  };

  newNote.cancelChange = function () {
    const el = document.getElementById("cancelChange");
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("cancel change");
      window.location.replace("index.html");
    });
  };
  return newNote;
}

document.addEventListener("DOMContentLoaded", async () => {
  const newNote= NewNote();
      
  newNote.getCurrentUser();
  newNote.setupLogout();
  newNote.setupSave();
  newNote.cancelChange();

  

})

