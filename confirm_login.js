userInfo = {
    uid: "",
    name: "",
    photoUrl: ""
}

document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            userInfo.uid = user.uid
            userInfo.name = user.displayName
            userInfo.photoUrl = user.photoURL
            return
        }

        //if user is null, you're not logged in. Redirect to homepage
        alert("you are not logged in")
        window.location.replace("./index.html")
    })
})

function getUserInfo()
{
    return userInfo;
}