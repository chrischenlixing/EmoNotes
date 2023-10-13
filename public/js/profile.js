function Profile() {
  const profile = {};

  let currentUser = null;

  function renderProfile(user) {
    console.log(user);
    const el = document.getElementById("username");
    el.innerHTML = `${user.user}`;
    const myschool = document.getElementById("school");
    myschool.innerHTML = `${user.school}`;
    const mymajor = document.getElementById("major");
    mymajor.innerHTML = `${user.major}`;
    
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  profile.getCurrentUser = async function () {
    let res;
    try {
      res = await fetch("./getCurrentUser");
      const resUser = await res.json();
      if (resUser.isLoggedIn) {
        currentUser = resUser.user;
        renderUsername(currentUser.user);
      } else {
        currentUser = null;
        redirect("login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  function renderUsername(username) {
    console.log("renderUsername");
    const usernameEl = document.getElementById("navUsername");
    usernameEl.innerHTML = "Welcome, " + username + "!";
  }

  profile.getProfile = async function () {
    let res;
    try {
      res = await fetch("./getUser");
      const user = await res.json();
      renderProfile(user);
    } catch (err) {
      console.log(err);
    }
  };

  profile.setupEdit = function () {
    const el = document.getElementById("edit");
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("edit");
      window.location.replace("editprofile.html");
    });
  };

  profile.setupCancel = function () {
    const el = document.getElementById("cancelChange");
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("cancel change");
      window.location.replace("index.html");
    });
  };

  return profile;
}

document.addEventListener("DOMContentLoaded", async () => {
  const profile= Profile();
      
  profile.getProfile();
  profile.setupEdit();
  profile.setupCancel();
  

})
