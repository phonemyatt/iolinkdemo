var socket = io();

var N = 10;
var lifeexp = 0;
var ophour = 0;
var pricaptemp = 0;
var seccaptemp = 0;

var config = {
      type: "line",
      data: {
      labels: [],
      datasets: [{
        label: "Voltage",
        data: [],
        backgroundColor: "rgba(255,87,51,0.2)",
        borderColor: "rgba(255,87,51,0.4)",
        borderWidth: 1
      }, {
        label: "Current",
        data: [],
        backgroundColor: "rgba(51,0,255,0.2)",
        borderColor: "rgba(51,0,255,0.4)",
        borderWidth: 1
      }]
    }
};

// fillColor: "rgba(51,0,255,0.2)",
// strokeColor: "rgba(51,0,255,1)",
// pointColor: "rgba(51,0,255,1)",
// pointStrokeColor: "#fff",
// pointHighlightFill: "#fff",
// pointHighlightStroke: "rgba(51,0,255,1)"

var ctx;
var line_example_chart;

window.onload = function main() {   
    ctx = document.getElementById("canvas").getContext("2d");
    line_example_chart = new Chart(ctx,config);
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

socket.on('voutiout', function (data) {    
    document.getElementById("devicetext").innerText= data.Product;
    console.log(config);
    if (config.data.labels.length > 9) {
        config.data.labels.shift();   
        config.data.datasets[0].data.shift();
        config.data.datasets[1].data.shift();
    }
    config.data.labels.push(data.Time);
    config.data.datasets[0].data.push(data.Voltage);
    config.data.datasets[1].data.push(data.Current);
    line_example_chart.update();
});

socket.on('operatinghour', function(data) {
    ophour = parseInt(data) || ophour;
    document.getElementById('deviceoperatinghours').innerText = ophour + 'hrs';
})

socket.on('expectedlifetime', function(data) {
    lifeexp = parseInt(data) || lifeexp;
    document.getElementById('devicelife').innerText = lifeexp + 'years';
})

socket.on('primcaptemp', function(data) {
    pricaptemp = parseInt(data) || pricaptemp;
    document.getElementById('primcaptemp').innerText = pricaptemp + '*C';
})

socket.on('seccaptemp', function(data) {
    seccaptemp = parseInt(data) || seccaptemp;
    document.getElementById('seccaptemp').innerText = seccaptemp + '*C';
})

socket.on('clientcount', function(data) {
    console.log(data);
})
