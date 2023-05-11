const net = require('net')
const uuid = require('uuid')
const usernameRegex = /\/username/gi
let clientsArr = []


let server = net.createServer(client => {
    client.uuid = uuid.v4()
    client.userName = createUsername(client.uuid)
    clientsArr.push(client)

    client.write(`Welcome to the server, ${client.userName}`)
    console.log(`User ${client.userName} has joined the server`)

    client.on('data', (data) => {
        let strData = data.toString().trim()

        if (strData[0] !== '/') {
            console.log(`${client.userName} said: ${strData}`)
            
            clientsArr.forEach(clientEle => {
                if (clientEle.uuid !== client.uuid) {
                    clientEle.write(`${client.userName} said: ${strData}`)
                }
            })
        } else if (strData.match(usernameRegex)) {
            let currUser = clientsArr.filter(clientEle => clientEle.uuid === client.uuid)
            let oldUserName = currUser[0].userName
            let newUserName = strData.split(' ')[1]
            let userNamePass = true

            
            
            clientsArr.forEach(clientEle => {
                if (clientEle.userName === newUserName) {
                    console.log('------ SAME USERNAME -----')
                    console.log(clientEle.userName)
                    console.log('--------------------------')
                    userNamePass = false
                }
                
                if (clientEle.uuid !== client.uuid && userNamePass) {
                    clientEle.write(`${oldUserName} has updates their username to ${newUserName} .`)
                }
            })
            
            if(userNamePass) {
                currUser[0].userName = newUserName
                updateClientArr(currUser[0])
                client.write(`You have updated your user name to ${client.userName}`)
                console.log(`${oldUserName} has updates their username to ${client.userName} .`)
            } else {
                client.write(`${newUserName} is not available. Please choose a different username.`)
            }
            
        } else {
            console.log(strData)
        }
    })

}).listen(5000, () => {
    console.log('listening on port: 5000')
})


function createUsername (str) {
    let endNum = str.slice((str.length-6), str.length)
    return `Guest${endNum}`
}

function updateClientArr (obj) {
    clientsArr.forEach((clientEle, i) => {
        if (clientEle.uuid === obj.uuid) {
            clientEle[i] = obj
        }
    })
    // console.log(`clientArr: ${clientsArr}`)
}