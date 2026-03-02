loggedIn = false

document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            loggedIn = true
            window.location.replace("./games.html")
        }
    })
})

function login()
{
    if (loggedIn == false)
    {
        window.location.replace("./signup.html")
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var userInfo = result.user;
            sessionStorage.setItem("registeredToFirebase", false)
            
            loggedIn = true
        })
    }
}