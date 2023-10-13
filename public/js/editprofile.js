function EditProfile() {
  const editProfile = {};
  const divMsg = document.querySelector("div#msg");

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  function renderProfile(user) {
    console.log(user);
    const el = document.getElementById("username");
    el.value = `${user.user}`;
    const profilePictureInput = document.getElementById(
      "profilePictureSelector",
    );
    profilePictureInput.value = "";
    const myschool = document.getElementById("myschool");
    myschool.value = `${user.school}`;
    const mymajor = document.getElementById("major");
    mymajor.value = `${user.major}`;
  }

  editProfile.getProfile = async function () {
    let res;
    try {
      res = await fetch("./getUser");
      const user = await res.json();
      renderProfile(user);
    } catch (err) {
      console.log(err);
    }
  };

  editProfile.setupSave = function () {
    const form = document.querySelector("form#editprofile");
    const linkLogout = document.getElementById("save");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log(form);
      res = await fetch("./updateProfile", {
        method: "POST",
        body: new URLSearchParams(new FormData(form)),
      });
      const response = await res.json();
      showMessage(response.msg);
      setTimeout(() => redirect("/profile"), 1000);
    });
  };
  return editProfile;
}

document.addEventListener("DOMContentLoaded", async () => {
  const editProfile = EditProfile();
      
  editProfile.setupSave();
  editProfile.getProfile();

})

