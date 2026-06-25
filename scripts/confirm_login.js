userInfo = {
    uid: "",
    name: "",
    photoUrl: ""
}

document.addEventListener("DOMContentLoaded", function () {

    //const img = document.getElementById("profileImg")
    //img.src = localStorage.getItem('userImg');

    firebase.auth().onAuthStateChanged((user) => {
        if (user)
        {
            userInfo.uid = user.uid
            userInfo.name = user.displayName
            userInfo.photoUrl = user.photoURL

            localStorage.setItem('userImg', userInfo.photoUrl);
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
    var idkHowObjectsWorkInJavascript = {
        uid: "",
        name: "",
        photoUrl: ""
    }

    await firebase.database().ref('/registeredUsers/' + uid).once('value', (snapshot) => {
        const userInfo = snapshot.val();
        //if user is not registered in firebase
        if (userInfo == null)
        {
            return null
        }
        idkHowObjectsWorkInJavascript.uid = userInfo.uid
        idkHowObjectsWorkInJavascript.name = userInfo.displayName
        idkHowObjectsWorkInJavascript.photoUrl = userInfo.photoUrl
    });
    
    return idkHowObjectsWorkInJavascript;
}

function toggleFunMode()
{
    const element = document.getElementById("subscribe")
    const i = document.getElementById("f")

    if (element.checked)
    {
        document.body.style.background = "linear-gradient(to bottom right, rgb(101, 190, 60), rgb(54, 134, 240), red)"
        document.body.style.backgroundSize = "600% 600%"
        document.body.style.animation = "gradient  8s ease infinite"
        document.body.style.backgroundColor = "rgb(250, 240, 226)"
        document.body.style.height = "100vh"
        document.body.style.overflow = "hidden"
        i.style.display = "none"
    }
    else
    {
        document.body.style = ""
        i.style.display = ""
    }
}