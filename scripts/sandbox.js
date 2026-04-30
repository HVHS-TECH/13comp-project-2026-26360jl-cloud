var responses = {
}

var l

async function makeTrue(input)
{
    l = await getUserInfoFromUID("2u0ixpUp8cMGs79iFU9ZNmTUUkB2")
    console.log(l.name)
    responses[input] = true
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
document.addEventListener("DOMContentLoaded", async function () {
    console.log(makeTrue("id")())

    var queue = 0
    while(queue < priorityFreeIndex)
    {
        var id = responses[priority[queue]]
        console.log(id)
        if (id == true)
        {
            queue++
            console.log(l)
        }
        await sleep(1)
    }
})

priority = []
priorityFreeIndex = 0

function registerAsync(name, func)
{
    responses[name] = false
    priority[priorityFreeIndex] = name
    priorityFreeIndex++;
    func(name)
}