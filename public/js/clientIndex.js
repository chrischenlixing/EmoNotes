function ClientIndex() {
  const clientIndex = {};
  const divMsg = document.querySelector("div#msg");

  let currentUser = null;

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }


  function getRandomColor() {
    const minBrightness = 200; 
    const randomChannel = () => Math.floor(Math.random() * (255 - minBrightness + 1)) + minBrightness;
    const red = randomChannel().toString(16).padStart(2, '0');
    const green = randomChannel().toString(16).padStart(2, '0');
    const blue = randomChannel().toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
  }

  function renderPosts(posts) {
    console.log(posts)
    const list = document.getElementById("list");
    list.innerHTML = '';

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

      if ((i + 1) % 3 === 0) {
        const lineBreak = document.createElement("div");
        lineBreak.className = "w-100"; 
        list.appendChild(lineBreak);
      }
    }
  }


  function sortPostsByTitle(posts, sortOrder) {
    if (sortOrder === "ascending") {
      return posts.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return posts.sort((a, b) => b.title.localeCompare(a.title));
    }
  }
  
  async function getPosts(sortOrder = "ascending") {
    let res;
    try {
      res = await fetch(`./listNotes?sortOrder=${sortOrder}`);
      const posts = await res.json();
  
      const sortedPosts = sortPostsByTitle(posts, sortOrder);
  
      renderPosts(sortedPosts);
    } catch (err) {
      console.log(err);
    }
  }


  clientIndex.changeOrder = function () {
    const orderSelect = document.getElementById("orderSelect");
    const selectedOrder = orderSelect.value;
    console.log('ok')
    getPosts(selectedOrder); 
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

  clientIndex.sort = function (){
    var selectElement = document.getElementById("orderSelect");

    selectElement.addEventListener("change", function() {
    clientIndex.changeOrder();
})
  }


  return clientIndex;
}

document.addEventListener("DOMContentLoaded", async () => {
  const clientIndex = ClientIndex();
      
      clientIndex.getCurrentUser();
      clientIndex.setupLogout();
      clientIndex.setupNewpostClick();
      clientIndex.sort();
      clientIndex.setupSignup();

})


