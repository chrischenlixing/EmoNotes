function Profile() {
  const profile = {};

  function renderProfile(user) {
    console.log(user);
    const el = document.getElementById("username");
    el.innerHTML = `${user.user}`;
    const myschool = document.getElementById("school");
    myschool.innerHTML = `${user.school}`;
    const mymajor = document.getElementById("major");
    mymajor.innerHTML = `${user.major}`;
    
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
    const ed = document.getElementById("edit");
    ed.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("edit");
      window.location.replace("editprofile.html");
    });
  };

  profile.setupCancel = function () {
    const cg = document.getElementById("cancelChange");
    cg.addEventListener("click", async (event) => {
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
