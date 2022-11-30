
function doModule11_2(inputs) {

    if (typeof inputs.real_eps1Val != 'undefined') {
        real_eps1 = inputs.real_eps1Val;
    }
    if (typeof inputs.imag_eps1Val != 'undefined') {
        imag_eps1 = inputs.imag_eps1Val;
    }
    if (typeof inputs.freqVal != 'undefined') {
        freq = inputs.freqVal;
    }
    if (typeof inputs.rmsheightVal != 'undefined') {
        rmsheight = inputs.rmsheightVal;
    }
    if (typeof inputs.correl_lengthVal != 'undefined') {
        correl_length = inputs.correl_lengthVal;
    }
    if (typeof inputs.albedoVal != 'undefined') {
        albedo = inputs.albedoVal;
    }
    if (typeof inputs.extVal != 'undefined') {
        ext = inputs.extVal;
    }
    if (typeof inputs.thicknessVal != 'undefined') {
        thickness = inputs.thicknessVal;
    }

    if (typeof inputs.real_eps2Val != 'undefined') {
        real_eps2 = inputs.real_eps2Val;
    }
    if (typeof inputs.imag_eps2Val != 'undefined') {
        imag_eps2 = inputs.imag_eps2Val;
    }
    if (typeof inputs.rmsheight2Val != 'undefined') {
        rmsheight2 = inputs.rmsheight2Val;
    }


    

    var d1=[];
    var d2 =[];
    var d3 = [];

    var hh, vv, hv;

    var kappa_e= ext;

    var aa=[];
    
        
        for (var i = 0; i <= 70; i += 1) {

            theta = 1.*i;

            aa = S2RTR_DistinctUB(real_eps1, -imag_eps1,real_eps2, -imag_eps2,
                             freq,rmsheight,rmsheight2,albedo,kappa_e,
                             thickness, theta);

            hh = aa[1];
            vv = aa[0];

            d1.push([theta, hh]);
            d2.push([theta, vv]);

        }

        //alert(d1);


    var data_hh = {
        color: "rgb(123, 100, 255)",
        label: "<b>hh polarization</b>",
        data: d1
    };

    var data_vv = {
        color: "rgb(255, 10, 13)",
        label: "<b>vv polarization</b>",
        data: d2
    };


    // create the plot:
    var options = {
        xaxis: { min: 0, max: 70, tickFormatter: xAxisLabeller },
        yaxis: { //min: -40, max: 0,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };
    
    $.plot($("#plotModule11_2"), [ data_hh, data_vv, d3 ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}


//**************************************************************
function SMART_ForwardModel(eps,theta,s,f) {

    var result = new Array();

    eps_pr = eps.re;

    lmda = 30./f; // wavelength in cm

    ks = s * (2*Math.PI / lmda); // calculate roughness parameter

    theta = theta * (Math.PI/180.0); // incidence angle in radian

    sig_0_hh = Math.pow(10.,-2.75) * Math.pow(Math.cos(theta),1.5) /Math.pow(Math.sin(theta),5.) *Math.pow(lmda,0.7)
        * Math.pow(ks*Math.sin(theta),1.4) * Math.pow(10.,0.028 * eps_pr * Math.tan(theta)); 

    sig_0_vv = Math.pow(10.,-2.35) * Math.pow(Math.cos(theta),3.) /Math.pow(Math.sin(theta),3.) *Math.pow(lmda,0.7)
        * Math.pow(ks*Math.sin(theta),1.1) * Math.pow(10.,0.046 * eps_pr * Math.tan(theta));

    sig_0_vv = 10.*Math.log(sig_0_vv)/Math.LN10;
    sig_0_hh = 10.*Math.log(sig_0_hh)/Math.LN10;
    
    result[0] = sig_0_vv;
    result[1] = sig_0_hh;
    
    return result;
}



//************************************************************
function PRISM1_ForwardModel(eps,theta_deg,s,f) {
    var result = new Array();

    var a=[];

    
    var ks = s * (2*Math.PI *f/0.3); // calculate roughness parameter

    var theta = theta_deg * (Math.PI/180.0); // incidence angle in radian

    var gamma0 = Fresn_Refl0(eps); //reflectivity (normal incidence)

    var a = Fresn_Refl(eps, theta); 
    var gammav = a[0];
    var gammah = a[1];


    var p = ( 1.- Math.pow(2. *theta/Math.PI, 1./(3.*gamma0)) * Math.exp(-ks) ); 
    p = p*p;

    var q = 0.23 * Math.sqrt(gamma0) *( 1. - Math.exp(-ks));

    var g = 0.70 *(1. - Math.exp(-0.65 * Math.pow(ks,1.8)));

    var sigvv = g * Math.pow(Math.cos(theta),3.) /Math.sqrt(p) * (gammav + gammah);




    result[0] = 10.*Math.log(sigvv)/Math.LN10;     // vv
    result[1] = 10.*Math.log(sigvv * p)/Math.LN10; // hh
    result[2] = 10.*Math.log(sigvv * q)/Math.LN10; // vh



    return result;
}


//************************************************************
function Fresn_Refl0(eps) {
    // calculates Fresnel reflectivity at normal incidence.
    var ss = Math.Complex(0.,0.);
    var one = Math.Complex(1.,0.);
    ss = eps.sqrt();
    return (one.sub(ss)).div(one.add(ss)).norm();
}

//************************************************************
function Fresn_Refl(eps,theta) {
    // calculates Fresnel reflectivities of v and h-polarizations at given set
    // of incidence angles.
    var result = new Array();
    var rho = [];
    var one=Math.Complex(1.,0.);

    rho = refl_coef(theta, one, eps);

    result[0] = rho[0].norm();
    result[1] = rho[1].norm();

    return result;
}
//************************************************************
function refl_coef(the1, eps1, eps2) {
    // calculates the v and h-polarized reflection coefficients of a plane
    // dielectric surface
    var result = new Array();
    var one=Math.Complex(1.,0.);

    var n1 = eps1.sqrt();
    var n2 = eps2.sqrt();

    var tt = (n1.mul(Math.sin(the1))).div(n2);
    //costh2 = Math.sqrt(1. - tt.mul(tt));
    var costh2 = (one.sub(tt.mul(tt))).sqrt();
    var costh1 = Math.cos(the1);

    var rho_v =  ( (n2.mul(costh1)).sub(n1.mul(costh2))   ).div(   (n2.mul(costh1)).add(n1.mul(costh2)) );
    rho_v = rho_v.mul(-1.);
    var rho_h =  ( (n1.mul(costh1)).sub(n2.mul(costh2))    ).div(  (n1.mul(costh1)).add(n2.mul(costh2)) );

    result[0] = rho_v;
    result[1] = rho_h;

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




//************************************************************************
function S2RTR_DiffuseUB(epsr,epsi,f,s,a,kappa_e,d, theta){

    var theta_r = theta *Math.PI/180.; //transform to radian
    var kappa_s = a * kappa_e; //scattering coefficient

    //-- call the PRISM-1 surface scattering model
    var eps=Math.Complex(epsr,epsi);
    var ans=[];
    ans = PRISM1_ForwardModel(eps,theta,s,f);
    var sig_s_vv = ans[0];
    var sig_s_hh = ans[1];



    //document.getElementById('debug').innerHTML = "<br/>sigvv = "+sig_s_vv+",  sighh="+sig_s_hh;

    
    // convert from dB power to linear power:
    sig_s_vv  = Math.pow(10.,0.1*sig_s_vv); 
    sig_s_hh  = Math.pow(10.,0.1*sig_s_hh);



    //-- calculate transmissivity in layer
    var tau = kappa_e *d /Math.cos(theta_r);
    var T = Math.exp(-tau);
    var Tsq = T*T;

    //-- calculate reflectivity of lower interface
    var ans=[];
    ans = ReflTransm_PlanarBoundary(1.0, 0.0, epsr, epsi, theta);
    var gammah = ans[2];
    var gammav = ans[3];



    //-- calculate the total backscattering coefficient according to eq 11.23
    var sigma_0_vv = Tsq*sig_s_vv + 0.75*a * Math.cos(theta_r) *(1- Tsq)
        *(1 + gammav*gammav* Tsq) + 3. * 2. * kappa_s * d * gammav * Tsq;

    var sigma_0_hh = Tsq*sig_s_hh + 0.75*a * Math.cos(theta_r) *(1- Tsq)
        *(1 + gammah*gammah * Tsq) + 3. * 2. * kappa_s * d * gammah * Tsq;


    //if(theta<45){
    //    document.getElementById('debug').innerHTML = "<br/>in diffuseub: a = "+a;
    //}

    sigma_0_vv = 10.* Math.log(sigma_0_vv)/Math.LN10;
    sigma_0_hh = 10.* Math.log(sigma_0_hh)/Math.LN10;

    var result = new Array();
    result[0] = sigma_0_vv;
    result[1] = sigma_0_hh;
    return result;

}


//************************************************************************

function S2RTR_DistinctUB(epsr2,epsi2,epsr3,epsi3,f,s1,s3,a,kappa_e,d, theta) {

    var theta_r = theta *Math.PI/180.; //transform to radian

    var one  = Math.Complex(1.,0.);
    var eps2 = Math.Complex(epsr2,epsi2);
    var eps3 = Math.Complex(epsr3,epsi3);

    var sin_thetar = Math.sin(theta_r);
    //thetapr = Math.asin(Math.sqrt(1/epsr2)*sin(theta_r)); % angle inside the layer #2
    //thetapr = thetapr *180/pi ;  % transform to degrees
    
    // ...............temporary............................
    // adib is going to make this real somehow. for now do cabs()
    var thetapr = Math.asin(Math.sqrt(1./epsr2)*sin_thetar);
    var thetaprd = thetapr*180./Math.PI;


    //costhetapr = sqrt( 1 - 1/epsr2 .*sin(theta_r)^2);
    var costhetapr = Math.sqrt( 1. - 1./epsr2 *sin_thetar*sin_thetar );

    var kappa_s = a * kappa_e ; //scattering coefficient

    //---- call the PRISM-1 surface scattering model
    //--  scattering due to top interface
    var bb=[];
    bb = PRISM1_ForwardModel(eps2,theta,s1,f);
    var sig_s_vv = bb[0];
    var sig_s_hh = bb[1];
    var sig_12_vv  = Math.pow(10.,0.1*sig_s_vv); // transform to linear power
    var sig_12_hh  = Math.pow(10.,0.1*sig_s_hh);



    //--  scattering due to bottom interface
    // note here we have assumed that PRISM1 model can be still used by
    // considering the ratio between the dielectric constants across the surface
    // boundary as the new dielectric constant input (i.e. used the dielectric
    // contrast as input).
    var eps_ratio = eps3.div(eps2);
    var bb=[];
    bb = PRISM1_ForwardModel(eps_ratio,thetaprd,s3,f);
    var sig_s_vv = bb[0];
    var sig_s_hh = bb[1];
    var sig_23_vv  = Math.pow(10.,0.1*sig_s_vv);
    var sig_23_hh  = Math.pow(10.,0.1*sig_s_hh);



    //-- calculate transmissivity in layer
    //tau = kappa_e *d /costhetapr;
    var tau = (one.div(costhetapr)).mul(-kappa_e *d);
    var T = tau.exp();

    //-- calculate reflectivity of upper interface
    var bb=[];
    bb = ReflTransm_PlanarBoundary(1.0, 0.0, epsr2, epsi2, theta);
    var Th_12 = bb[6];
    var Tv_12 = bb[7];



    //-- calculate reflectivity of lower interface
    var bb=[];
    bb = ReflTransm_PlanarBoundary(epsr2, epsi2, epsr3, epsi3, thetaprd);
    var gammah_23 = bb[2];
    var gammav_23 = bb[3];

    //-- calculate the total backscattering coefficient according to eq 11.79
    var sigma_0_vv = Tv_12*Tv_12 *( T*T*sig_23_vv + 0.75*a * costhetapr *(1- T*T)
                 *(1. + gammav_23*gammav_23* T*T) + 3. * 2. * kappa_s * d * gammav_23 * T*T)
        + sig_12_vv;

    var sigma_0_hh = Th_12*Th_12 *( T*T*sig_23_hh + 0.75*a * costhetapr *(1- T*T)
                 *(1. + gammah_23*gammah_23 * T*T) + 3. * 2. * kappa_s * d * gammah_23 * T*T)
        + sig_12_hh;



    sigma_0_vv = 10.* Math.log(sigma_0_vv)/Math.LN10;
    sigma_0_hh = 10.* Math.log(sigma_0_hh)/Math.LN10;


    var result = new Array();
    result[0] = sigma_0_vv;
    result[1] = sigma_0_hh;
    return result;

}
