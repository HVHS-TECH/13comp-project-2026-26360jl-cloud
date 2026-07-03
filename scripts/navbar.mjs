document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
        <header class="onetwothreefour border-bottom">
            <div class="dropdown fries">
                <a
                    href="#"
                    class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <img
                        src=""
                        alt="mdo"
                        width="32"
                        height="32"
                        class="rounded-circle"
                        id="profileImg"
                    />
                </a>
                <ul class="dropdown-menu text-small">
                    <li><button onclick="openStatPopup()" class="dropdown-item">My Stats</button></li>
                                        <li><button class="dropdown-item" onclick="toggleFunMode()"><input class="form-check-input" type="checkbox" id="subscribe" name="newsletter""><span class="rainbow-text">Rainbow bg</span></button></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button onclick="logout()" class="dropdown-item" href="#">Sign out</button></li>
                </ul>
            </div>
            <div class="keepthelinkshere">
                <a href="games.html" class="pa">Games</a>
                <a href="leaderboards.html" class="pa">Leaderboards</a>
            </div>
        </header>

        <div class="modalT" id="modal">
            <div class="modal-inner">
              <h2>My Stats:</h2>
              <p id="stats-info">loading...</p>
              <button class="btn btn-dark" onclick="closeStatPopup()">Close</button>
            </div>
        </div>
    `;

    document.getElementById("header-container").insertAdjacentHTML("afterbegin", headerHTML);

    setProfilePicture();
    setBGStyle(true);
})

function setProfilePicture()
{
    const img = document.getElementById("profileImg")
    var temp = false

    if (img != null)
    {
        var photoUrl = localStorage.getItem('userImg')

        if (photoUrl == null) { setProfilePicture(); return }
        else img.src = photoUrl;
    }
}

function logout()
{
    localStorage.removeItem("userUid");
    localStorage.removeItem("userImg");
    localStorage.removeItem("userName");
    firebase.auth().signOut();
}

function openStatPopup()
{
    const modal = document.getElementById("modal")
    const statsInfo = document.getElementById("stats-info")
    modal.classList.add("open")

    firebaseRead("leaderboard/" + getUserInfo().uid, (snapshot) => {
        const STATS = snapshot.val();
        //this can happen when a new user checks their stats but they haven't played any games yet
        //so they don't exist in the leaderboard data
        if (STATS == null)
        {
            statsInfo.innerHTML = "GTN Wins: 0, GTN Losses: 0, Winrate: 0%";
            return;
        }

        var wins = STATS.gtnWins;
        var losses = STATS.gtnLosses;

        if (wins == null) { wins = 0; leaderboardValidateStats(getUserInfo().uid, "gtnWins") }
        if (losses == null) { losses = 0; leaderboardValidateStats(getUserInfo().uid, "gtnLosses") }

        const wr = wins / (wins + losses)
        const rounded = Math.round(wr * 100) / 100

        statsInfo.innerHTML =   "GTN Wins: " + wins + ", " +
                                "GTN Losses: " + losses + ", " +
                                "Winrate: " + rounded * 100 + "%";
    })
}

function closeStatPopup()
{
    const modal = document.getElementById("modal")
    modal.classList.remove("open")
}

function toggleFunMode()
{
    const element = document.getElementById("subscribe")
    element.checked = !element.checked;

    localStorage.setItem("rainbowBG", element.checked);

    setBGStyle();
}

function setBGStyle(setup)
{
    //this is for when you load a new page to recheck the checkbox
    if (setup)
    {
        const element = document.getElementById("subscribe")
        //this converts the local storages string to a boolean
        const boolVal = localStorage.getItem("rainbowBG") === "true"; 
        element.checked = boolVal;
    }

    if (localStorage.getItem("rainbowBG") == "true")
    {
        document.body.style.background = "linear-gradient(to bottom right, rgb(101, 190, 60), rgb(54, 134, 240), red)"
        document.body.style.backgroundSize = "600% 600%"
        document.body.style.animation = "gradient  8s ease infinite"
        document.body.style.backgroundColor = "rgb(250, 240, 226)"
        document.body.style.height = "100vh"
        document.body.style.overflow = "hidden"
    }
    else
    {
        document.body.style = ""
    }
}