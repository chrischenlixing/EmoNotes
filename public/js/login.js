function Login() {
  const login = {};
  const divMsg = document.querySelector("div#msg");


  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }


  function redirect(page) {
    window.location.replace(page + ".html");
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


  return login;
}

document.addEventListener("DOMContentLoaded", async () => {
  const login= Login();
      
  login.setupLogin();

})


