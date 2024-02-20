var d10 = [];
var d20 = [];
var d00 = [];

var g_i=0;
var g_deltar;
var g_a_1, g_a_2;
var g_theplot;
var a_x1, a_y1, phi_x1,phi_y1;
var a_x2, a_y2, phi_x2,phi_y2;
var x1, x2, y1,y2, x,y;


function doinits() {
    setInterval(animatePlot,10);
}


function doModule_ok_3(inputs) {
    if (typeof inputs.e1Val != 'undefined') {
        a_1 = inputs.e1Val;
    }
    if (typeof inputs.e2Val != 'undefined') {
        a_2 = inputs.e2Val;
    }
    if (typeof inputs.dphiVal != 'undefined') {
        delta = inputs.dphiVal;
    }
    if (typeof inputs.iThetaVal != 'undefined') {
        ThetaG = inputs.iThetaVal;
    }
    if (typeof inputs.iTauVal != 'undefined') {
        TauG = inputs.iTauVal;
    }   
    g_i=0;
    //var alpha, cosdelta, twopsi, psi, chi;


    deltar = delta * Math.PI/180.; // transform the phase angle to radian
    Theta = ThetaG * Math.PI/180.;
    Tau = TauG * Math.PI/180.;

    g_deltar = deltar;
    g_a_1 = a_1;
    g_a_2 = a_2;
   
    cTh1=Math.cos(Theta); sTh1=Math.sin(Theta);
    cTa1=Math.cos(Tau);   sTa1=Math.sin(Tau);

    a_x1=Math.sqrt(cTh1*cTh1*cTa1*cTa1+sTh1*sTh1*sTa1*sTa1);
    a_y1=Math.sqrt(sTh1*sTh1*cTa1*cTa1+cTh1*cTh1*sTa1*sTa1);
    phi_x1=Math.atan2(-sTh1*sTa1, cTh1*cTa1);
    phi_y1=Math.atan2( cTh1*sTa1, sTh1*cTa1);

    cTh2=Math.cos(Theta+Math.PI/2); sTh2=Math.sin(Theta+Math.PI/2);
    cTa2=Math.cos(-Tau);    sTa2=Math.sin(-Tau);

    a_x2=Math.sqrt(cTh2*cTh2*cTa2*cTa2+sTh2*sTh2*sTa2*sTa2);
    a_y2=Math.sqrt(sTh2*sTh2*cTa2*cTa2+cTh2*cTh2*sTa2*sTa2);
    phi_x2=Math.atan2(-sTh2*sTa2, cTh2*cTa2);
    phi_y2=Math.atan2( cTh2*sTa2, sTh2*cTa2);




    //alpha = Math.atan2(a_y, a_x); // calculate the auxiliary angle (0<alpha<pi/)

    //cosdelta = Math.cos(deltar);

    //twopsi = Math.abs(Math.atan( Math.tan(2* alpha) * Math.cos(deltar))); 

    //if (alpha > Math.PI/4) {
      //  psi = 0.5 * (Math.PI - twopsi);
    //} else {
   //     psi = 0.5 * twopsi;
   // }

   // chi = 0.5 * Math.asin( Math.sin(2*alpha) * Math.sin(deltar)); 

    //document.getElementById('text1').innerHTML = "delta ="+delta.toString()+" radians";
    //document.getElementById('text2').innerHTML = "alpha ="+alpha.toString()+" radians";


   // if (cosdelta > 0) {
  //      psi = Math.abs(psi);
 //   }
 //   if (cosdelta < 0) {
//        psi = - Math.abs(psi);
  //  }

    //var psid, chid;
   // psid = psi * 180./Math.PI; // transform to degrees
   // chid = chi * 180./Math.PI;// transform to degrees

    //document.getElementById('text1').innerHTML = "a_x ="+a_x.toString();
    //document.getElementById('text2').innerHTML = "a_y ="+a_y.toString();
    
   // document.getElementById('text1').innerHTML = "Rotation angle, <i>&psi;</i> ="+psid.toFixed(2)+" degrees";
   // document.getElementById('text2').innerHTML = "Ellipticity angle, <i>&chi;</i> ="+chid.toFixed(2)+" degrees";


    var d11 = [];
    var d21 = [];
    var d01 = [];
    //var r,x,y;

    //r=Math.sqrt(a_x*a_x + a_y*a_y*Math.cos(deltar)*Math.cos(deltar));

    d10 =[];d20=[];d00=[];
    for (var i = 0; i <= 360; i += 1) {
        x1 = g_a_1*a_x1*Math.cos(1.*i*Math.PI/180. + phi_x1);
        y1 = g_a_1*a_y1*Math.cos(1.*i*Math.PI/180. + phi_y1);

        x2 = g_a_2*a_x2*Math.cos(1.*i*Math.PI/180. + phi_x2 + g_deltar);
        y2 = g_a_2*a_y2*Math.cos(1.*i*Math.PI/180. + phi_y2 + g_deltar);

        x = x1+x2;
        y = y1+y2;

        d10.push([x1, y1]);
        d20.push([x2, y2]);
        d00.push([x, y]);
    }
 
  

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

    var data_d10 = {
        color: "rgb(255, 10, 13)",
        //lines: {show: false},
        //points: {show: true},
        data: d10
    };

    var data_d20 = {
        color: "rgb(255,0,255)",
        //lines: {show: false},
        //points: {show: true},
        data: d20
    };

    var data_d00 = {
        color: "rgb(0,0,255)",
        //lines: {show: false},
        //points: {show: true},
        data: d00
    };

    g_theplot = $.plot($("#plotModule_ok_3"), [ data_d10, data_d20, data_d00, d11,d21,d01 ], options);

};


function animatePlot(){
    var d11=[];
    var d21=[];
    var d01=[];

    if (g_i>361) {
        d10.shift();
        d20.shift();
        d00.shift();
        //g_i=1;
    };


    d11.push([0.,0.]);
    d21.push([0.,0.]);
    d01.push([0.,0.]);

    x1 = g_a_1*a_x1*Math.cos(1.*g_i*Math.PI/180. + phi_x1);
    y1 = g_a_1*a_y1*Math.cos(1.*g_i*Math.PI/180. + phi_y1);
    x2 = g_a_2*a_x2*Math.cos(1.*g_i*Math.PI/180. + phi_x2 + g_deltar);
    y2 = g_a_2*a_y2*Math.cos(1.*g_i*Math.PI/180. + phi_y2 + g_deltar);
    x = x1+x2;
    y = y1+y2;

    d10.push([x1,y1]);
    d11.push([x1,y1]);
    d20.push([x2,y2]);
    d21.push([x2,y2]);
    d00.push([x,y]);
    d01.push([x,y]);

    g_i = g_i +1;

    var data_d10 = {
        color: "rgb(255, 10, 13)",
        lines: {show: false},
        points: {show: true},
        data: d10
    };

    var data_d20 = {
        color: "rgb(255, 0, 255)",
        lines: {show: false},
        points: {show: true},
        data: d20
    };

    var data_d00 = {
        color: "rgb(0, 0, 255)",
        lines: {show: false},
        points: {show: true},
        data: d00
    };

    var data_d11 = {
        color: "rgb(123, 100, 255)",
        lines: {show: true},
        points: {show: true},
        data: d11
    };
    
    var data_d21 = {
        color: "rgb(123, 100, 255)",
        lines: {show: true},
        points: {show: true},
        data: d21
    };

    var data_d01 = {
        color: "rgb(1, 1, 1)",
        lines: {show: true},
        points: {show: true},
        data: d01
    };

    g_theplot.setData([ data_d10, data_d20, data_d00, data_d11, data_d21, data_d01]);

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
