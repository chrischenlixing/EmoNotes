function Login() {
  const login = {};
  const divMsg = document.querySelector("div#msg");

  let currentUser = null;

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }

  function renderPosts(posts) {
    const divContent = document.querySelector("#content");
    divContent.innerHTML = `
      <h2>Posts for ${currentUser.user}</h2>
      ${posts.map((p) => `<div>Text: ${p.text}</div>`).join("")}
    `;
  }

  async function getPosts() {
    let res;
    try {
      res = await fetch("./getPosts");
      const posts = await res.json();
      renderPosts(posts);
    } catch (err) {
      console.log(err);
    }
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  async function getCurrentUser() {
    let res;
    try {
      res = await fetch("./getCurrentUser");
      const resUser = await res.json();
      if (resUser.isLoggedIn) {
        currentUser = resUser.user;
        getPosts();
      } else {
        currentUser = null;
        redirect("login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  login.setupLogin = function () {
    console.log("Setup login");
    const form = document.querySelector("form#login");
    let res;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Authenticating");
      try {
        res = await fetch("./authenticate", {
          method: "POST",
          body: new URLSearchParams(new FormData(form)),
        });
        const resUser = await res.json();
        if (resUser.isLoggedIn) {
          redirect("index");
        } else {
          showMessage(resUser.err);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  login.setupSignup = function () {
    console.log("Setup signup");
    const form = document.querySelector("form#signup");
    let res;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Signing up");
      try {
        res = await fetch("./signup", {
          method: "POST",
          body: new URLSearchParams(new FormData(form)),
        });
        const resUser = await res.json();
        if (resUser.isLoggedIn) {
          redirect("index");
        } else {
          showMessage(resUser.err);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  login.setupLogout = function () {
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

  login.getCurrentUser = getCurrentUser;
  return login;
}

document.addEventListener("DOMContentLoaded", async () => {
  const login= Login();
      
  login.setupLogin();
  login.setupSignup();

})


