var outstring="";

function doModule12_7(inputs) {

    var theta =45.;

    if (typeof inputs.real_eps1Val != 'undefined') {
        real_eps1 = inputs.real_eps1Val;
    }
    if (typeof inputs.imag_eps1Val != 'undefined') {
        imag_eps1 = -inputs.imag_eps1Val;
    }
    if (typeof inputs.real_eps2Val != 'undefined') {
        real_eps2 = inputs.real_eps2Val;
    }
    if (typeof inputs.imag_eps2Val != 'undefined') {
        imag_eps2 = -inputs.imag_eps2Val;
    }
    if (typeof inputs.freqVal != 'undefined') {
        freq = inputs.freqVal;
    }
    if (typeof inputs.thicknessVal != 'undefined') {
        thickness = inputs.thicknessVal;
        theta     = thickness;
    }

    

    if(imag_eps1 > 0.) imag_eps1=-imag_eps1;
    if(imag_eps2 > 0.) imag_eps2=-imag_eps2;


    var d1=[];
    var d2 =[];
    var d3 = [];


    var h, v;

    var a=[];
    
    var options={};


    //outstring="eps1="+real_eps1+"+I"+imag_eps1+", eps2="+real_eps2+"+I"+imag_eps2+", theta="+theta+", thickness="+thickness+", freq="+freq;
    //document.getElementById('debug').innerHTML = outstring;

    if(xaxis_choice == "incidence") {
        document.getElementById('xAxisLabel').innerHTML = "Incidence Angle (degrees)";

        
        for (var i = 0; i <= 90; i += 1) {

            theta = 1.*i;


            a=CohEmissivity_TwoLayer(real_eps1, imag_eps1, 
                                   real_eps2, imag_eps2,
                                   theta, thickness, freq) 


            h = a[1];
            v = a[0];

            d1.push([theta, h]);
            d2.push([theta, v]);


        }

        //alert(d1);
        

    // create the plot:
    options = {
        xaxis: { min: 0, max: 90, tickFormatter: xAxisLabeller },
        yaxis: { min: 0., max: 1.1,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };


    } else {
        document.getElementById('xAxisLabel').innerHTML = "Thickness (m)";

        for (var i = 0; i <= 400; i += 1) {

            thickness = i*2./399.;


            a=CohEmissivity_TwoLayer(real_eps1, imag_eps1, 
                                   real_eps2, imag_eps2,
                                   theta, thickness, freq) 


            h = a[1];
            v = a[0];

            d1.push([thickness, h]);
            d2.push([thickness, v]);

        }

    // create the plot:
    options = {
        xaxis: { min: 0, max: 2, tickFormatter: xAxisLabelleraa },
        yaxis: { min: 0., max: 1.1,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };


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


    
    $.plot($("#plotModule12_7"), [ data_hh, data_vv, d3 ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(2) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}

function xAxisLabelleraa(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(2) + "</span>";
}

//*************************************************************************
function CohEmissivity_TwoLayer(eps2r, eps2i, eps3r, eps3i, theta_i, d, f) {

    var eps1r = 1.;
    var eps1i = 0.;
    theta1 = theta_i*Math.PI/180.; //transform to radians

    var eps2 = Math.Complex(eps2r, eps2i);
    var eps3 = Math.Complex(eps3r, eps3i);

    var n2 = eps2.sqrt(); //calc index of refraction
    var n1 = Math.Complex(1.0,0.0);

    var absnratio = (n1.div(n2)).abs();

    var theta2 = Math.asin(absnratio * Math.sin(theta1)); // incidence angle in medium 2 (refracted)

    var k = 2.*Math.PI *f/ 0.3; //wavenumber 

    //-- calculate reflectivies at the two interfaces

    //- 12 interface
    var bb=[];
    bb=ReflTransm_PlanarBoundary(eps1r, eps1i, eps2r, eps2i, theta_i);
    var AArhoh12 = bb[0];
    var AArhov12 = bb[1];

    //- 23 interface
    var bb=[];
    bb=ReflTransm_PlanarBoundary(eps2r, eps2i, eps3r, eps3i, theta2*180./Math.PI);
    var AArhoh23 = bb[0];
    var AArhov23 = bb[1];


    var rhoh12 = Math.Complex(AArhoh12[0],AArhoh12[1]);
    var rhov12 = Math.Complex(AArhov12[0],AArhov12[1]);
    var rhoh23 = Math.Complex(AArhoh23[0],AArhoh23[1]);
    var rhov23 = Math.Complex(AArhov23[0],AArhov23[1]);

    //outstring=outstring+".    theta_i="+theta_i.toFixed(5)+", rhoh12="+rhoh12.re.toFixed(5)+"+I"+rhoh12.im.toFixed(5)+", rhov12="+rhov12.re.toFixed(5)+"+I"+rhov12.im.toFixed(5);

    var alpha = k* ((eps2.sqrt()).im);
    var beta  = k* ((eps2.sqrt()).re);

    var gamma = Math.Complex(beta, alpha);

    //outstring=outstring+".     theta_i="+theta_i.toFixed(5)+", alpha="+alpha.toFixed(5)+", beta="+beta.toFixed(5);
    //outstring="k="+k+", f="+f.toFixed(5)+" sqrt-eps2="+(eps2.sqrt()).re.toFixed(5)+" +I "+(eps2.sqrt()).im.toFixed(5);


    var ii = Math.Complex(0.,1.);
    var a1 = ii.mul(-2.).mul(gamma).mul(d).mul(Math.cos(theta2));
    var one = Math.Complex(1.,0.);


    //rho_v = (rhov12 + rhov23 * exp(-2*1i*gamma*d*cos(theta2))) ./ ...
    //(1 + rhov12 * rhov23 * exp(-2*1i*gamma*d*cos(theta2))); 
    var rho_v = (rhov12.add( rhov23.mul( a1.exp() ) )).div(one.add( rhov12.mul(rhov23).mul( a1.exp() ) ));

    //rho_h = (rhoh12 + rhoh23 * exp(-2*1i*gamma*d*cos(theta2))) ./ ...
    //(1 + rhoh12 * rhoh23 * exp(-2*1i*gamma*d*cos(theta2))); 
    var rho_h = (rhoh12.add( rhoh23.mul( a1.exp() ) )).div(one.add( rhoh12.mul(rhoh23).mul( a1.exp() ) ));

    //outstring=outstring+".     theta_i="+theta_i.toFixed(5)+", rho_v="+rho_v.re.toFixed(5)+" +I "+rho_v.im.toFixed(5);

    //outstring=outstring+".     theta_i="+theta_i.toFixed(5)+",rhov12.re="+rhov12.re.toFixed(5)+", rhov23.re="+rhov23.re.toFixed(5)+", theexp="+a1.im.toFixed(5);

    var e_v_coh = 1.- rho_v.norm();
    var e_h_coh = 1.- rho_h.norm();

    var result = new Array();
    result[0] = e_v_coh;
    result[1] = e_h_coh;
    
    return result;

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

