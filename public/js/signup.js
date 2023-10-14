function SignUp() {
    const signup = {};
    const divMsg = document.querySelector("div#msg");


    function showMessage(msg) {
        divMsg.querySelector("#msgContent").innerHTML = msg;
        divMsg.style.display = "block";
      }

      function redirect(page) {
        window.location.replace(page + ".html");
      }

    signup.setupSignUp = function () {
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
  return signup;
}

document.addEventListener("DOMContentLoaded", async () => {
    const signup = SignUp();
        signup.setupSignUp();
  })
  
