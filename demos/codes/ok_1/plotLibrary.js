var d2 = [];
var d3 = [];

var g_i=0;
var g_deltar;
var g_a_x, g_a_y;
var g_theplot;
var g_DoP;
var NoiseVar=1/2.;//1/2.;
var Jxx;
var Jyy;
var Jxy;

function doinits() {
    setInterval(animatePlot,10);
}

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}


function doModule_ok_1(inputs) {
    if (typeof inputs.exVal != 'undefined') {
        a_x = inputs.exVal;
    }
    if (typeof inputs.eyVal != 'undefined') {
        a_y = inputs.eyVal;
    }
    if (typeof inputs.dphiVal != 'undefined') {
        delta = inputs.dphiVal;
    }
    if (typeof inputs.iDoPVal != 'undefined') {
        DoP = inputs.iDoPVal;
    }
    g_i=0;
    var alpha, cosdelta, twopsi, psi, chi;


    deltar = delta * Math.PI/180.; // transform the phase angle to radian

    g_deltar = deltar;
    g_a_x = a_x;
    g_a_y = a_y;
    g_DoP = Math.sqrt(DoP);
  

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
    Jxx=0;Jyy=0;Jxy=0;
    for (var i = 0; i <= 360; i += 1) {
        nx=gaussianRandom(0., Math.sqrt(NoiseVar));
        ny=gaussianRandom(0., Math.sqrt(NoiseVar));
        x = g_DoP*a_x*Math.cos(1.*i*Math.PI/180.)+(1.-g_DoP)*nx;
        y = g_DoP*a_y*Math.cos(1.*i*Math.PI/180. + deltar)+(1.-g_DoP)*ny;
        Jxx=Jxx + x*x;
        Jyy=Jyy + y*y;
        Jxy=Jxy + x*y;

        d3.push([x, y]);
    }
    Jxx=Jxx/360;Jyy=Jyy/360;Jxy=Jxy/360;

    document.getElementById('iJxx').innerHTML = Jxx.toFixed(2);
    document.getElementById('iJxy').innerHTML = Jxy.toFixed(2);
    document.getElementById('iJyx').innerHTML = Jxy.toFixed(2);
    document.getElementById('iJyy').innerHTML = Jyy.toFixed(2);
     

    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    limits=1.5;
    var options = {
        xaxis: { min: -limits, max: limits,
                 tickFormatter: xAxisLabeller },
        yaxis: { min: -limits, max: limits,
                 tickFormatter: yAxisLabeller }
    };

    var data_d3 = {
        color: "rgb(255, 10, 13)",
        //lines: {show: false},
        //points: {show: true},
        data: d3
    };


   
    g_theplot = $.plot($("#plotModule_ok_1"), [ d1, d2, data_d3 ], options);

};


function animatePlot(){
    var d1=[];

    if (g_i>361) {
        d3.shift();
        //g_i=1;
    };


    d1.push([0.,0.]);
    nx=gaussianRandom(0, Math.sqrt(NoiseVar));
    ny=gaussianRandom(0, Math.sqrt(NoiseVar));
 
    x = g_DoP*g_a_x*Math.cos(1.*g_i*Math.PI/180.)+(1-g_DoP)*nx;
    y = g_DoP*g_a_y*Math.cos(1.*g_i*Math.PI/180. + g_deltar)+(1-g_DoP)*ny;
    d1.push([x,y]);
    d3.push([x,y]);

    g_i = g_i +1;

    var data_d3 = {
        color: "rgb(255, 10, 13)",
        lines: {show: false},
        points: {show: true},
        data: d3
    };

    var data_d1 = {
        color: "rgb(123, 100, 255)",
        lines: {show: true},
        points: {show: true},
        data: d1
    };

    g_theplot.setData([ data_d1, d2, data_d3 ]);

    g_theplot.draw();

    //document.getElementById("iText").innerHTML = d1;

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val + "</span>";
};

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
};
