var d2 = [];
var d3 = [];

var g_i=0;
var g_deltar;
var g_a_x, g_a_y;
var g_theplot;
var g_DoP;
var NoiseVar=1/2.;//1/2.;

var Pwave;
var Pant;
var ctemp;
var ctemp1;

function doinits() {
    setInterval(animatePlot,10);
}


function doModule_ok_2(inputs) {
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
    
    document.getElementById('text1').innerHTML = "Incoming Wave's Rotation Angle, <i>&psi;</i> ="+psid.toFixed(2)+" degrees";
    document.getElementById('text2').innerHTML = "Incoming Wave's Ellipticity Angle, <i>&chi;</i> ="+chid.toFixed(2)+" degrees";

    const onej=math.complex(0,1);
    const minus_one=math.complex(-1,0);

    Pwave=math.complex(0,0);

    ctemp=math.multiply(onej,Math.tan(chi));    
    Pwave=math.add(Math.tan(psi),ctemp);
    ctemp1=math.multiply(onej,Math.tan(psi)*Math.tan(chi));
    ctemp=math.multiply(-1,ctemp1);
    ctemp1=math.add(1,ctemp);
    Pwave=math.divide(Pwave,ctemp1);

    var d1 = [];
    var r,x,y;

    //r=Math.sqrt(a_x*a_x + a_y*a_y*Math.cos(deltar)*Math.cos(deltar));

    d3 =[];
  
    for (var i = 0; i <= 360; i += 1) {
        Pant=Math.tan(1.*i*Math.PI/180.);
        
        ctemp=math.multiply(Pwave,Pant);
        Rho=math.add(1,ctemp);
        ctemp=math.multiply(math.conj(Pwave),Pant);
        ctemp1=math.add(1,ctemp);
        Rho=math.multiply(Rho,ctemp1);
        ctemp=math.multiply(Pwave,math.conj(Pwave));
        ctemp1=math.add(1,ctemp);
        ctemp=math.multiply(ctemp1,(1+Pant*Pant));
        Rho=math.divide(Rho,ctemp);
        x=math.abs(Rho)*Math.cos(1.*i*Math.PI/180.);
        y=math.abs(Rho)*Math.sin(1.*i*Math.PI/180.)
    
        d3.push([x, y]);
    }


    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    limits=1.1;
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


   
    g_theplot = $.plot($("#plotModule_ok_2"), [ d1, d2, data_d3 ], options);

};


function animatePlot(){
    var d1=[];

    if (g_i>361) {
        //d3.shift();
        //g_i=1;
    };


    d1.push([0.,0.]);
        
    Pant=Math.tan(1.*g_i*Math.PI/180.);
        
        ctemp=math.multiply(Pwave,Pant);
        Rho=math.add(1,ctemp);
        ctemp=math.multiply(math.conj(Pwave),Pant);
        ctemp1=math.add(1,ctemp);
        Rho=math.multiply(Rho,ctemp1);
        ctemp=math.multiply(Pwave,math.conj(Pwave));
        ctemp1=math.add(1,ctemp);
        ctemp=math.multiply(ctemp1,(1+Pant*Pant));
        Rho=math.divide(Rho,ctemp);
        x=math.abs(Rho)*Math.cos(1.*g_i*Math.PI/180.);
        y=math.abs(Rho)*Math.sin(1.*g_i*Math.PI/180.)
   
    d1.push([x,y]);
    

    g_i = g_i +1;

    var data_d3 = {
        color: "rgb(255, 10, 13)",
        lines: {show: true},
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
