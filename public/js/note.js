function Note() {
  const note = {};
  const divMsg = document.querySelector("div#msg");



  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }

  function renderPosts(post) {
    const title = document.getElementById("title");
    title.innerHTML = `${post.title}`;
    const course = document.getElementById("course");
    course.innerHTML = `${post.course}`;
    const content = document.getElementById("content");
    content.innerHTML = `${post.content}`;
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  note.getCurrentUser = async function () {
    let res;
    try {
      res = await fetch("./getCurrentUser");
      const resUser = await res.json();
      if (! resUser.isLoggedIn) {
        redirect("login");
      } 
    } catch (err) {
      console.log(err);
    }
  };


  note.setupLogout = () => {
    const linkLogout = document.querySelector("#linkLogout");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("lgout");
      res = await fetch("/logout");
      const resLogout = await res.json();
      showMessage(resLogout.msg);
      setTimeout(() => redirect("/login"), 1000);
    });
  };

  note.getNote = async function () {
    let res;
    try {
      const p = new URLSearchParams(window.location.search);
      res = await fetch("./getNote?id=" + p.get("id"));
      const post = await res.json();
      console.log(post);
      if (!post) {
        console.log(post);
        redirect("/index");
      } else {
        renderPosts(post);
      }
    } catch (err) {
      console.log(err);
    }
  };

  note.setupEdit = function () {
    const el = document.getElementById("edit");
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("edit");
      const p = new URLSearchParams(window.location.search);
      window.location.replace("editnote.html?id=" + p.get("id"));
    });
  };

  note.setupDelete = function () {
    const el = document.getElementById("delete");
    let res;
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("delete");
      const p = new URLSearchParams(window.location.search);
      res = await fetch("/deleteNote?id=" + p.get("id"));
      await res.json();
      showMessage("Note deleted!");
      setTimeout(() => redirect("/index"), 1000);
    });
  };

  return note;
}

document.addEventListener("DOMContentLoaded", async () => {
  const note= Note();
      
  note.getNote();
  note.setupEdit();
  note.setupDelete();
  note.setupLogout();
  note.getCurrentUser();

})


