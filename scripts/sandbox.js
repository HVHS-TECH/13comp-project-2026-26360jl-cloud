var userInfo={};
userInfo.uid = {
    uid1 : {
        wins: 0,
        losses: 1
    },
    uid2 : {
        wins: 2,
        losses: 3
    },
    uid3 : {
        wins: 4,
        losses: 0
    }
}

console.log(userInfo)
console.log(userInfo["uid"].age)
console.log(Object.keys(userInfo.uid))
var items = Object.keys(userInfo.uid)
console.log(items) 
items.sort((a, b) => userInfo.uid[b].wins - userInfo.uid[a].wins);
console.log(items)

var c = false
c = test()
console.log(c)
console.log(testtest())

function test(_callback)
{
    return true
}

function testtest()
{
    var cases = [
        false, false, false, false, false
    ]
    cases[0] = test()
    cases[1] = test()
    cases[2] = test()
    cases[3] = test()
    cases[4] = test()
    var breakout = false
    while (!breakout)
    {
        for (var i = 0; i < cases.length; i++)
        {
            if (cases[i] == false) break
        }
        breakout = true
    }
    return cases
}