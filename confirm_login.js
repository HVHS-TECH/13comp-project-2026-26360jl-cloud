document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            return
        }

        alert("you are not logged in")
        window.location.replace("./index.html")
    })
})