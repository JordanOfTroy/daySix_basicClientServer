const net = require('net')

let client = net.createConnection({port: 5000}, () => {
    console.log('connected on port: 5000')
})

client.setEncoding('utf8')

client.on('data', (data) => {
    console.log(data)
})

process.stdin.on('data', (data) => {
    client.write(data)
})