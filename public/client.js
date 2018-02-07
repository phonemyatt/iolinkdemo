var socket = io();


var config = {
    type: 'line',
    data: {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [{
        label: 'Voltage',
        data: [12, 19, 3, 17, 6, 3, 7],
        backgroundColor: "rgba(153,255,51,0.4)"
      }, {
        label: 'Current',
        data: [2, 29, 5, 5, 2, 3, 10],
        backgroundColor: "rgba(255,153,0,0.4)"
      }]
    }
};

window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
};


function getData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open('GET', 'data', true);
    xhttp.send();
}

function getIOLink() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            document.getElementById("devicetext").innerText=this.responseText;
        }
    };
    xhttp.open('GET', 'iolink', true);
    xhttp.send();
}



socket.on('message', function (data) {
    console.log(data);
});

function setData(data) {
    
}

