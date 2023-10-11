function ClientIndex() {
  const clientIndex = {};
  const divMsg = document.querySelector("div#msg");

  let currentUser = null;

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }


  function getRandomColor() {
    const minBrightness = 200; // Adjust this value for lighter or darker colors
    const randomChannel = () => Math.floor(Math.random() * (255 - minBrightness + 1)) + minBrightness;
    const red = randomChannel().toString(16).padStart(2, '0');
    const green = randomChannel().toString(16).padStart(2, '0');
    const blue = randomChannel().toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
  }

  function renderPosts(posts) {
    const list = document.getElementById("list");

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      const col = document.createElement("div");
      col.className = "post";

      const card = document.createElement("div");
      card.className = "card h-100 shadow";
      card.style.backgroundColor = getRandomColor();

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      cardBody.style.overflow = "hidden"; 
      cardBody.style.whiteSpace = "nowrap";

      const h5 = document.createElement("h5");
      h5.className = "card-title";
      h5.innerHTML = `${post.title}`;

      const small = document.createElement("small");
      small.className = "text-muted";
      small.innerHTML = `${post.course}`;

      const p = document.createElement("p");
      p.className = "card-text";
      p.innerHTML = `${post.content}`;

      const readMoreLink = document.createElement("a");
      readMoreLink.className = "btn btn-primary";
      readMoreLink.href = "note.html?id=" + post._id;
      readMoreLink.textContent = "Read More";

      cardBody.appendChild(h5);
      cardBody.appendChild(small);
      cardBody.appendChild(p);
      cardBody.appendChild(readMoreLink);

      card.appendChild(cardBody);
      col.appendChild(card);

      list.appendChild(col);

      // Add a line break after every third post
      if ((i + 1) % 3 === 0) {
        const lineBreak = document.createElement("div");
        lineBreak.className = "w-100"; // Force a new row
        list.appendChild(lineBreak);
      }
    }
  }



  async function getPosts(sortOrder) {
    let res;
    try {
      res = await fetch(`./listNotes?sortOrder=${sortOrder}`);
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
        renderUsername(currentUser.user);
      } else {
        currentUser = null;
        redirect("login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function renderUsername(username) {
    console.log("renderUsername");
    const usernameEl = document.getElementById("navUsername");
    const myAccountLink = document.getElementById("accountName");
    myAccountLink.innerHTML = "Welcome, " + username + "!";
    usernameEl.innerHTML = "My Account";
  }

  clientIndex.setupLogin = function () {
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

  clientIndex.setupSignup = function () {
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

  clientIndex.setupLogout = function () {
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

  clientIndex.setupNewpostClick = function () {
    const np = document.getElementById("newpost");
    np.addEventListener("click", () => {
      window.location.replace("newnote.html");
    });
  };

  clientIndex.getCurrentUser = getCurrentUser;

  return clientIndex;
}

export default ClientIndex();
