const socket = io();

function getData() {    
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {        
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open('GET', 'data', true);
    xhttp.send();    
}

socket.on('message', function(socket){
    console.log(socket);
})