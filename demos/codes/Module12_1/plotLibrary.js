
function doModule12_1(inputs) {

    if (typeof inputs.real_eps1Val != 'undefined') {
        real_eps1 = inputs.real_eps1Val;
    }
    if (typeof inputs.imag_eps1Val != 'undefined') {
        imag_eps1 = -inputs.imag_eps1Val;
    }

    

    var d1=[];
    var d2 =[];
    var d3 = [];


    var h, v;

    var a=[];
    
        
        for (var i = 0; i <= 90; i += 1) {

            theta = 1.*i;



            a = Emissivity_SmoothSurf(real_eps1, imag_eps1, theta);

            h = a[1];
            v = a[0];

            d1.push([theta, h]);
            d2.push([theta, v]);

        }


    var data_hh = {
        color: "rgb(123, 100, 255)",
        label: "<b>h polarization</b>",
        data: d1
    };

    var data_vv = {
        color: "rgb(255, 10, 13)",
        label: "<b>v polarization</b>",
        data: d2
    };


    // create the plot:
    var options = {
        xaxis: { min: 0, max: 90, tickFormatter: xAxisLabeller },
        yaxis: { min: 0., max: 1.1,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };
    
    $.plot($("#plotModule12_1"), [ data_hh, data_vv, d3 ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(2) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}



//**************************************************************
function Emissivity_SmoothSurf(epsr, epsi, theta1) {

    var eps1r = 1.; // dielectric constant of medium 1
    var eps1i = 0.;

    var bb=[];
    bb = ReflTransm_PlanarBoundary(eps1r, eps1i, epsr, epsi, theta1);
    var gammah = bb[2];
    var gammav = bb[3];
    e_v = 1.- gammav;
    e_h = 1.- gammah;

    var result = new Array();
    result[0] = e_v;
    result[1] = e_h;
    
    return result;
}


//************************************************************
function ReflTransm_PlanarBoundary(eps1r, eps1i, eps2r, eps2i, theta1d) {
   
    var result = new Array();

    var theta1 = theta1d*Math.PI/180.;


    var theta, h, v;
    var eps1=[];
    var eps2=[];

    var rhov=[];
    var rhoh=[];

    var tauh=[];
    var tauv=[];

    var sin_theta2=[];
    var cos_theta2=[];
    var one=[];

    one[0]=1.0;
    one[1]=0.0;

    eps1[0] = eps1r;
    eps1[1] = eps1i;
    eps2[0] = eps2r;
    eps2[1] = eps2i;
    
    var j;
 


    sin_theta2 = crmult(cdiv(csqrt(eps1), csqrt(eps2)) , Math.sin(theta1));
    cos_theta2 = csqrt(csub(one,cmult( sin_theta2,sin_theta2)));

    rhoh = csub(crmult(csqrt(eps1),Math.cos(theta1)), cmult(cos_theta2,csqrt(eps2)));
    rhoh = cdiv(rhoh , cadd(crmult(csqrt(eps1),Math.cos(theta1)) , cmult(csqrt(eps2),cos_theta2)));

    rhov = csub(cmult(csqrt(eps1),cos_theta2), crmult(csqrt(eps2),Math.cos(theta1)));
    rhov = cdiv(rhov, cadd(cmult(csqrt(eps1),cos_theta2) , crmult(csqrt(eps2),Math.cos(theta1)) ));

    tauh = cadd(one,rhoh);
    tauv = crmult(cdiv(cadd(one , rhov),cos_theta2),Math.cos(theta1));

    h = cabs(tauh);
    v = cabs(tauv);



    gammah = cabs_sqrd(rhoh);
    gammav = cabs_sqrd(rhov);
        
    Th = 1-gammah;
    Tv = 1-gammav;


   result[0]= rhoh;
   result[1]= rhov;
   result[2]= gammah;
   result[3]= gammav;
   result[4]= tauh;
   result[5]= tauv;
   result[6]= Th;
   result[7]= Tv;
            
   return result;

}

function csqrt(a){
    var r, theta, rootr;

    var result = new Array();
    
    r = Math.sqrt(a[0]*a[0] + a[1]*a[1]);
    theta = Math.atan2(a[1],a[0]);
    rootr = Math.sqrt(r);

    result[0] = rootr*Math.cos(0.5*theta);
    result[1] = rootr*Math.sin(0.5*theta);
    return result;

}

function cdiv(a,b){
    var result = new Array();

    var c=[];
    c[0]=b[0];
    c[1]=-b[1];
    
    var d=[];
    d=cmult(a,c);

    var denom;
    denom = b[0]*b[0] + b[1]*b[1];

    result[0] = d[0]/denom;
    result[1] = d[1]/denom;
    return result;
}

function cmult(a,b){
    var result = new Array();
    result[0] = a[0]*b[0] - a[1]*b[1];
    result[1] = a[1]*b[0] + a[0]*b[1];
    return result;
}

function crmult(a,b){
    var result = new Array();
    result[0] = a[0]*b;
    result[1] = a[1]*b;
    return result;
}

function cadd(a,b){
    var result = new Array();
    result[0] = a[0]+b[0];
    result[1] = a[1]+b[1];
    return result;
}

function csub(a,b){
    var result = new Array();
    result[0] = a[0]-b[0];
    result[1] = a[1]-b[1];
    return result;
}

function cabs_sqrd(a){
    return a[0]*a[0] + a[1]*a[1];
}

function cabs(a){
    return Math.sqrt(a[0]*a[0] + a[1]*a[1]);
}

