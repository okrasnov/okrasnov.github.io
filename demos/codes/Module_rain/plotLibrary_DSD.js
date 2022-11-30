
function doModule_DSD(inputs) {

    if (typeof inputs.rain_intensityVal != 'undefined') {
        rain_intensity1 = inputs.rain_intensityVal;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    var d4 = [];

    var radius;
    var lambda_MP,lambda_JD,lambda_JT;
    var MP_DSD, JD_DSD, data_JT;

    var N0_MP=16000;
    var N0_JD=60000;
    var N0_JT=2800;

    lambda_MP=8.2*Math.pow(rain_intensity1,-0.21);
    lambda_JD=11.4*Math.pow(rain_intensity1,-0.21);
    lambda_JT=6*Math.pow(rain_intensity1,-0.21);

    MP_Concentration1=Math.floor(N0_MP/lambda_MP);
    JD_Concentration1=Math.floor(N0_JD/lambda_JD);
    JT_Concentration1=Math.floor(N0_JT/lambda_JT);

    //MP_LWC1=(0.089)*Math.pow(rain_intensity1,0.84);
    MP_LWC1=(8*3.1415*0.001)*N0_MP/Math.pow(lambda_MP,4);
    JD_LWC1=(8*3.1415*0.001)*N0_JD/Math.pow(lambda_JD,4);
    JT_LWC1=(8*3.1415*0.001)*N0_JT/Math.pow(lambda_JT,4);
    MP_LWC1=Math.floor(MP_LWC1*1000.0)/1000.0;
    JD_LWC1=Math.floor(JD_LWC1*1000.0)/1000.0;
    JT_LWC1=Math.floor(JT_LWC1*1000.0)/1000.0;

    for (var i = 0; i <= 500; i += 1) {

        radius = 0.01*i;

        MP_DSD=N0_MP*Math.exp(-lambda_MP*radius);
        JD_DSD=N0_JD*Math.exp(-lambda_JD*radius); //Joss Drizzle
        //JW_DSD=14000*Math.exp(-8.2*Math.pow(rain_intensity1,-0.21)*radius); //Joss Widespread
        JT_DSD=N0_JT*Math.exp(-lambda_JT*radius); //Joss Thunderstorm


        d2.push([radius, MP_DSD]);
        d3.push([radius, JD_DSD]);
        d4.push([radius, JT_DSD]);
        }


    var data_MP = {
        color: "rgb(123, 100, 255)",
        label: "<b>Marshall-Palmer DSD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>",
        data: d2
    };

    var data_JD = {
        color: "rgb(255, 10, 13)",
        label: "<b>Joss DSD for Drizzle&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>",
        data: d3
    };

    var data_JT = {
        color: "rgb(10, 255, 13)",
        label: "<b>Joss DSD for Thunderstorm</b>",
        data: d4
    };

    // create the plot:
    var options = {
        xaxis: {min: 0, max: 5.0,
                 //ticks: [0.1,5,10,15,20,25,30,35,40,45,50,60,70,80,90,100],
                 tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 100000,
          transform: function (v) { return Math.log(v+0.001); },
                 ticks: [1,10,100,1000,10000,100000],
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "ne"
        }

    };



    $.plot($("#plotModule_DSD"), [ d1, data_MP,data_JD,data_JT], options);

}



function yAxisLabeller(val, axis) {
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

function xAxisLabeller(val, axis) {
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
}
