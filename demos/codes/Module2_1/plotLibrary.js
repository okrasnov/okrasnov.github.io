var d2 = [];
var d3 = [];

var g_i=0;
var g_deltar;
var g_a_x, g_a_y;
var g_theplot;

function doinits() {
    setInterval(animatePlot,10);
}

function doModule2_1(inputs) {
    if (typeof inputs.exVal != 'undefined') {
        a_x = inputs.exVal;
    }
    if (typeof inputs.eyVal != 'undefined') {
        a_y = inputs.eyVal;
    }
    if (typeof inputs.dphiVal != 'undefined') {
        delta = inputs.dphiVal;
    }

    var alpha, cosdelta, twopsi, psi, chi;


    deltar = delta * Math.PI/180.; // transform the phase angle to radian

    g_deltar = deltar;
    g_a_x = a_x;
    g_a_y = a_y;

    alpha = Math.atan2(a_y, a_x); // calculate the auxiliary angle (0<alpha<pi/)



    cosdelta = Math.cos(deltar);

    twopsi = Math.abs(Math.atan( Math.tan(2* alpha) * Math.cos(deltar))); 

    if (alpha > Math.PI/4) {
        psi = 0.5 * (Math.PI - twopsi);
    } else {
        psi = 0.5 * twopsi;
    }

    chi = 0.5 * Math.asin( Math.sin(2*alpha) * Math.sin(deltar)); 

    //document.getElementById('text1').innerHTML = "delta ="+delta.toString()+" radians";
    //document.getElementById('text2').innerHTML = "alpha ="+alpha.toString()+" radians";


    if (cosdelta > 0) {
        psi = Math.abs(psi);
    }
    if (cosdelta < 0) {
        psi = - Math.abs(psi);
    }

    var psid, chid;
    psid = psi * 180./Math.PI; // transform to degrees
    chid = chi * 180./Math.PI;// transform to degrees

    //document.getElementById('text1').innerHTML = "a_x ="+a_x.toString();
    //document.getElementById('text2').innerHTML = "a_y ="+a_y.toString();
    
    document.getElementById('text1').innerHTML = "Rotation angle, <i>&psi;</i> ="+psid.toFixed(2)+" degrees";
    document.getElementById('text2').innerHTML = "Ellipticity angle, <i>&chi;</i> ="+chid.toFixed(2)+" degrees";


    var d1 = [];
    var r,x,y;

    //r=Math.sqrt(a_x*a_x + a_y*a_y*Math.cos(deltar)*Math.cos(deltar));

    d3 =[];
    for (var i = 0; i <= 360; i += 1) {
        x = a_x*Math.cos(1.*i*Math.PI/180.);
        y = a_y*Math.cos(1.*i*Math.PI/180. + deltar);

        d3.push([x, y]);
    }
    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    var options = {
        xaxis: { min: -1.2, max: 1.2,
                 tickFormatter: xAxisLabeller },
        yaxis: { min: -1.2, max: 1.2,
                 tickFormatter: yAxisLabeller }
    };

    var data_d3 = {
        color: "rgb(255, 10, 13)",
        data: d3
    };


   
    g_theplot = $.plot($("#plotModule2_1"), [ d1, d2, data_d3 ], options);

};


function animatePlot(){
    var d1=[];

    d1.push([0.,0.]);
    x = g_a_x*Math.cos(1.*g_i*Math.PI/180.);
    y = g_a_y*Math.cos(1.*g_i*Math.PI/180. + g_deltar);
    d1.push([x,y]);

    g_i = g_i +1;

    var data_d1 = {
        color: "rgb(123, 100, 255)",
        lines: {show: true},
        points: {show: true},
        data: d1
    };

    var data_d3 = {
        color: "rgb(255, 10, 13)",
        data: d3
    };


    g_theplot.setData([ data_d1, d2, data_d3 ]);

    g_theplot.draw();

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val + "</span>";
};

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
};
