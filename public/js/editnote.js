function EditNote() {
  const editNote = {};
  const divMsg = document.querySelector("div#msg");

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  editNote.getNote = async function () {
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

  function renderPosts(post) {
    const title = document.getElementById("title");
    title.value = `${post.title}`;
    const course = document.getElementById("course");
    course.value = `${post.course}`;
    const content = document.getElementById("content");
    content.innerHTML = `${post.content}`;
  }

  editNote.setupSave = function () {
    const form = document.querySelector("form#editnote");
    const linkLogout = document.getElementById("save");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      const p = new URLSearchParams(window.location.search);
      res = await fetch("./editNote?id=" + p.get("id"), {
        method: "POST",
        body: new URLSearchParams(new FormData(form)),
      });
      const response = await res.json();
      showMessage(response.msg);
      setTimeout(() => redirect("/index"), 1000);
    });
  };

  editNote.cancelChange = function () {
    const el = document.getElementById("cancelNoteChange");
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("cancel change");
      const p = new URLSearchParams(window.location.search);
      const noteId = p.get("id");
      window.location.replace("note.html?id=" + noteId);
    });
  };

  return editNote;
}

export default EditNote();
