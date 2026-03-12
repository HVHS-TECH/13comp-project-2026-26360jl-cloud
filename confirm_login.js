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

async function getUserInfoFromUID(uid)
{
    idkHowObjectsWorkInJavascript = {
        uid: "",
        name: "",
        photoUrl: ""
    }

    await firebase.database().ref('/registeredUsers/' + uid).once('value', _checkFirebase);

    function _checkFirebase(snapshot)
    {
        const userInfo = snapshot.val();
        //if user is not registered in firebase
        if (userInfo == null)
        {
            return null
        }
        idkHowObjectsWorkInJavascript.uid = userInfo.uid
        idkHowObjectsWorkInJavascript.name = userInfo.displayName
        idkHowObjectsWorkInJavascript.photoUrl = userInfo.photoUrl
    }
    
    return idkHowObjectsWorkInJavascript;
}