userInfo = {
    uid: "",
    name: "",
    photoUrl: ""
}

document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            if (userInfo.uid == "")
            {
                userInfo.uid = user.uid
                userInfo.name = user.displayName
                userInfo.photoUrl = user.photoURL
            }
            return
        }

        alert("you are not logged in")
        window.location.replace("./index.html")
    })
})

function getUserInfo()
{
    return userInfo;
}