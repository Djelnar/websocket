var socket = new WebSocket(`ws://${window.location.hostname}:1488`)

function createPoint(props) {
    let messageElem = document.createElement('div')
    messageElem.appendChild(document.createTextNode(props.uniqId))
    messageElem.className = 'thing'
    messageElem.id = props.uniqId
    messageElem.style.top = `${props.y}px`
    messageElem.style.left = `${props.x}px`
    document.getElementById('root').appendChild(messageElem)
}

socket.onopen = function() {
    
}

socket.onmessage = function(event) {
    let inc = JSON.parse(event.data)
    inc.forEach((el, idx, arr) => {
        if (document.getElementById(el.uniqId)) {
            document.getElementById(el.uniqId).remove()
        }
        createPoint(el)
    })
}

document.querySelector('#root').addEventListener('mousemove', (e) => {
    let msg = JSON.stringify({
        x: e.clientX,
        y: e.clientY
    })
    socket.send(msg)
})