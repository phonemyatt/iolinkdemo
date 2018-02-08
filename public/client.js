var socket = io();

var N = 10;

var config = {
      type: 'line',
      data: {
      labels: [],
      datasets: [{
        label: 'Voltage',
        data: [],
        fillColor: "rgba(96,169,23,0.2)",
        strokeColor: "rgba(96,169,23,1)",
        pointColor: "rgba(96,169,23,1)",
        pointStrokeColor: "#60A917",
        pointHighlightFill: "#60A917",
        pointHighlightStroke: "rgba(96,169,23,1)"
      }, {
        label: 'Current',
        data: [],
        fillColor: "rgba(151,186,205,0.2)",
        strokeColor: "rgba(151,186,205,1)",
        pointColor: "rgba(151,186,205,1)",
        pointStrokeColor: "#DB0073",
        pointHighlightFill: "#DB0073",
        pointHighlightStroke: "rgba(151,186,205,1)"
      }]
    }
};

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

socket.on('message', function (data) {    
    document.getElementById("devicetext").innerText= data.Product;
    console.log(data);
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
