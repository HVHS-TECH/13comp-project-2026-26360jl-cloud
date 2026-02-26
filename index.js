loggedIn = false

document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            console.log("Logged in")
            loggedIn = true
            window.location.replace("./games.html")
        }
    })
})

function login()
{
    if (loggedIn == false)
    {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            loggedIn = true
        })
    }
}