
function doModule11_3(inputs) {

    if (typeof inputs.densityVal != 'undefined') {
        density = inputs.densityVal;
    }
    if (typeof inputs.radiusVal != 'undefined') {
        radius = inputs.radiusVal;
    }
    if (typeof inputs.tempVal != 'undefined') {
        temp = inputs.tempVal;
    }


    

    var d1=[];
    var d2 =[];
    var d3 = [];
    var d4 = [];
    var d5 = [];

    var hh, vv, hv;


    var freq;

    var bb=[];
    var ka, ke, ks, aa;

        
        for (var i = 1; i <= 100; i += 1) {

            freq = 0.1*i;

            bb = MieExtinc_DrySnow(density,radius,freq,temp);

            ka = bb[0];
            ks = bb[1];
            ke = bb[2];
            aa = bb[3];

            if(qqa == "on") d1.push([freq, ka]);
            if(qqs == "on") d2.push([freq, ks]);
            if(qqe == "on") d3.push([freq, ke]);
            if(qqal == "on") d4.push([freq, aa]);

        }

        //alert(d1);


    var data_ka = {
        color: "rgb(255, 10, 10)",
        //label: "<b>hh polarization</b>",
        data: d1
    };

    var data_ks = {
        color: "rgb(10, 255, 10)",
        //label: "<b>vv polarization</b>",
        data: d2
    };

    var data_ke = {
        color: "rgb(10, 10, 255",
        //label: "<b>vv polarization</b>",
        data: d3
    };

    var data_aa = {
        color: "rgb(0,0,0)",
        //label: "<b>vv polarization</b>",
        data: d4
    };


    // create the plot:
    

    document.getElementById('plotTitle').innerHTML = "<br/>";
    document.getElementById('yAxisLabel').innerHTML = "";

    var options = {
        xaxis: { min: 0, max: 10, tickFormatter: xAxisLabeller },
        yaxis: { //min: 0, max: 0.151,
                 tickFormatter: yAxisLabeller },
    };
    $.plot($("#plotModule11_3"), [ data_ka, data_ks, data_ke, data_aa], options);


}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(3) + "</span>";
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

//*************************************************************************

function MieExtinc_DrySnow(rho_s,ri,f,t) {

    var eps_b = 1.;// dielectric constant of background
    var rho_i = 0.9167; //density of ice (g /cm3)

    //- calculate relative dielectric constant of pure ice
    var eps=[];
    eps = RelDielConst_PureIce(t,f);

    //-- calculate the Mie efficiencies using Code 8.12
    var bb=[];
    bb = mie( eps[0], -eps[1], eps_b, 0.0, ri, f); 
    var Ea= bb[0];
    var Es=bb[1];
    var Ee=bb[2];
    var Eb=bb[3];

    var area = Math.PI * ri*ri;

    var Qs = Es * area;
    var Qa = Ea * area;
    var Qe = Ee * area;

    var Nv = rho_s /rho_i /(4./3. * area*ri); 


    var kappa_a = Nv * Qa;
    var kappa_s = Nv * Qs; 
    var kappa_e = Nv * Qe;

    var a = kappa_s /kappa_e;


    var result = new Array();
    result[0] = kappa_a;
    result[1] = kappa_s;
    result[2] = kappa_e;
    result[3] = a;
    return result;
}



//***************************************************************
function mie(pr, pi, br, bi, r, f){
    //particle eps = (pr-jpi)
    //background eps = (br-jbi)
    //sphere radius = r meters
    //f =freq ghz

    //--- Calculate Mie Scattering solution





    // debug only:
    //pr=3.1;
    //pi=-2.1;
    //br=1.0;
    //bi=0.0;
    //r=0.01;
    //f=10.;
        
        




    var epsp=Math.Complex(pr,pi);
    var epsb=Math.Complex(br,bi);
    var one=Math.Complex(1.,0.);


    

    //Calculation of Es
    var l=1;
    var sumTerm;
    var runSum=0.0;
    var oldSum=0.0;

    var chi = (20./3.)*Math.PI*r*f*Math.sqrt(br); // normalized circumference in background

    var np=Math.Complex(0.,0.);
    var nb=Math.Complex(0.,0.);
    var n=Math.Complex(0.,0.);

    var np = epsp.sqrt();// index of refraction of spherical particle
    var nb = epsb.sqrt();// index of refraction of background medium

    var n = np.div(nb);// relative index of refraction

    //document.getElementById('a1').innerHTML = "np= "+np.toString()+",   nb= "+nb.toString()+",   n= "+n.toString();



    // Values of W0 and W-1
    var W=Math.Complex(0.,0.);
    var W_1=Math.Complex(0.,0.);
    var W_2=Math.Complex(0.,0.);
    W_1.re =  Math.sin(chi);
    W_1.im =  Math.cos(chi);
    W_2.re =  Math.cos(chi);
    W_2.im = -Math.sin(chi);

    //if(f<10.01){
            //document.getElementById('a1').innerHTML = "W_1= "+W_1.toString()+",   W_2= "+W_2.toString()+",   chi= "+chi.toString();
    //}

    
    //Value of A0
    var A_1=Math.Complex(0.,0.);
    var A=Math.Complex(0.,0.);
    //A_1 = (n.mul(chi)).tan();
    //A_1 = one.div(A_1);

    A_1 = (n.mul(chi)).cos();
    var aaaa=(n.mul(chi)).sin();
    A_1 = A_1.div(aaaa);

    var a=Math.Complex(0.,0.);
    var b=Math.Complex(0.,0.);
    var bb=Math.Complex(0.,0.);

    //if(f<10.01){
    //    document.getElementById('a1').innerHTML = "A_1= "+A_1.toString()+",  n= "+n.toString();
    //}

  
    var cc;
  
    //document.getElementById('a1').innerHTML = "<br/> at1 l ="+l.toString()+"  endsum="+endSum(oldSum, runSum).toString();
        
    // while (l<50 || endSum(oldSum, runSum)==0){
    while (l<10 || endSum(oldSum, runSum)==0){
        // for speed:
        aa = l/chi;
        bb = (one.mul(l)).div( n.mul(chi) );
        cc = (2*l-1.)/chi;

        //W.re = cc*(W_1.re) - W_2.re;
        //W.im = cc*(W_1.im) - W_2.im;
        W= W_1.mul(cc).sub(W_2);

        //A = -bb + 1./(bb-A_1);
        A = (one.div( bb.sub(A_1) )).sub(bb);



    
        //a = ((A/n + aa).*real(W)-real(W_1)) ./ ((A/n+aa).*W-W_1);
        //b = ((n*A + aa).*real(W)-real(W_1)) ./ ((n*A+aa).*W-W_1);

        a = ( ( (A.div(n)).add(aa) ).mul(W.re) ).sub(W_1.re);
        a = a.div( ( W.mul((A.div(n)).add(aa)) ).sub(W_1) );

        b = (((A.mul(n)).add(aa)).mul(W.re)).sub(W_1.re);
        b = b.div( (W.mul((A.mul(n)).add(aa)) ).sub(W_1) );



    
        sumTerm = (2*l + 1.)*(a.norm()+b.norm());
        oldSum = runSum;
        runSum = runSum + sumTerm;



        //if(f<10.){
        //   document.getElementById('a1').innerHTML = "sumTerm= "+sumTerm.toString()+",   W_2= "+W_2.toString()+",   chi= "+chi.toString();
        //   return( [0.,0.,0.,0.] );
        //}




    
        //Increment Index varible
        l=l+1;




        //document.getElementById('a1').innerHTML = "runSum ="+runSum.toString();
        //document.getElementById('a1').innerHTML = "<br/> at2 l ="+l.toString();

   
        //Increment W terms
        W_2 = W_1;
        W_1 = W;


    
        //Increment A Terms
        A_1=A;


    
    }// end-while


    //if(f<10.01){
            //document.getElementById('a1').innerHTML = "W_1= "+W_1.toString()+",   W_2= "+W_2.toString()+",   W= "+W.toString();
            //document.getElementById('a1').innerHTML = "a= "+a.toString()+",   b= "+b.toString();
            //document.getElementById('a1').innerHTML = "runSum= "+runSum.toString();
            //if(l==20) return( [0.,0.,0.,0.] );
            //}


    //if(f<10.){
        //document.getElementById('a1').innerHTML = "<br/> at3 l ="+l.toString();
    //}

    //if(f<10.){
            //document.getElementById('a1').innerHTML = "W_1= "+W_1.toString()+",   W_2= "+W_2.toString()+",   chi= "+chi.toString();
    //}


    var Es = 2.*runSum/(chi*chi);





    //Calculation of Ee
    l=1;
    runSum=0.0;
    oldSum=0.0;

    //Values of W0 and W-1
    W_1.re =  Math.sin(chi);
    W_1.im =  Math.cos(chi);
    W_2.re =  Math.cos(chi);
    W_2.im = -Math.sin(chi);
    
    //Value of A0
    var A_1=Math.Complex(0.,0.);
    A_1 = (n.mul(chi)).cos();
    aaaa=(n.mul(chi)).sin();
    A_1 = A_1.div(aaaa);
            
    while (l<10 || endSum(oldSum, runSum)==0){
        // for speed:
        aa = l/chi;
        bb = (one.mul(l)).div( n.mul(chi) );
        cc = (2*l-1.)/chi;

        //W.re = cc*(W_1.re) - W_2.re;
        //W.im = cc*(W_1.im) - W_2.im;
        W= W_1.mul(cc).sub(W_2);

        //A = -bb + 1./(bb-A_1);
        A = (one.div( bb.sub(A_1) )).sub(bb);



    
        //a = ((A/n + aa).*real(W)-real(W_1)) ./ ((A/n+aa).*W-W_1);
        //b = ((n*A + aa).*real(W)-real(W_1)) ./ ((n*A+aa).*W-W_1);

        a = ( ( (A.div(n)).add(aa) ).mul(W.re) ).sub(W_1.re);
        a = a.div( ( W.mul((A.div(n)).add(aa)) ).sub(W_1) );

        b = (((A.mul(n)).add(aa)).mul(W.re)).sub(W_1.re);
        b = b.div( (W.mul((A.mul(n)).add(aa)) ).sub(W_1) );
    
        sumTerm = (2*l + 1.)*(a.re+b.re);
        oldSum = runSum;
        runSum = runSum + sumTerm;

        //Increment Index varible
        l=l+1;
    
        //Increment W terms
        W_2 = W_1;
        W_1 = W;
    
        //Increment A Terms
        A_1=A;
    
    }// end-while

    var Ee = 2.*runSum/(chi*chi);



    //Calculation of Eb
    l=1;

    var runSum=Math.Complex(0.,0.);
    var oldSum=Math.Complex(0.,0.);
    var sumTerm=Math.Complex(0.,0.);

    //Values of W0 and W-1
    W_1.re =  Math.sin(chi);
    W_1.im =  Math.cos(chi);
    W_2.re =  Math.cos(chi);
    W_2.im = -Math.sin(chi);
    
    //Value of A0
    var A_1=Math.Complex(0.,0.);
    A_1 = (n.mul(chi)).cos();
    aaaa=(n.mul(chi)).sin();
    A_1 = A_1.div(aaaa);

    while (l<10 || endSumc(oldSum, runSum)==0){
        // for speed:
        aa = l/chi;
        bb = (one.mul(l)).div( n.mul(chi) );
        cc = (2*l-1.)/chi;

        W= (W_1.mul(cc)).sub(W_2);

        //A = -bb + 1./(bb-A_1);
        A = one.div( bb.sub(A_1) ).sub(bb);
    
        //a = ((A/n + aa).*real(W)-real(W_1)) ./ ((A/n+l./chi).*W-W_1);
        //b = ((n*A + aa).*real(W)-real(W_1)) ./ ((n*A+l./chi).*W-W_1);

        a = (((A.div(n)).add(aa)).mul(W.re)).sub(W_1.re);
        a = a.div( (W.mul((A.div(n)).add(aa))).sub(W_1));

        b = (((A.mul(n)).add(aa)).mul(W.re)).sub(W_1.re);
        b = b.div( (W.mul((A.mul(n)).add(aa))).sub(W_1));
    
        sumTerm = (a.sub(b)).mul(Math.pow(-1.,l)*(2*l + 1.));
        oldSum = runSum;
        runSum = runSum.add(sumTerm);

        //Increment Index varible
        l=l+1;
    
        //Increment W terms
        W_2 = W_1;
        W_1 = W;
    
        //Increment A Terms
        A_1=A;
    
    }// end-while

    var Eb = runSum.norm()/(chi*chi);

    var Ea=Ee-Es;


    var result = new Array();
    result[0] =Ea;
    result[1] =Es;
    result[2] =Ee;
    result[3] =Eb;
    return result;


}

function endSum(A0, A1){
    tostop=1;
    if(A0 != 0.0){
        pDiff = Math.abs((A1-A0)/A0)*100.;
        if(pDiff>=0.001){
            tostop = 0;
        }
    } else {
        tostop = 0;
    }
    return tostop;
}

// complex version
function endSumc(A0, A1){
    tostop=1;
    if(A0.norm() != 0.0){
        pDiff = ((A1.sub(A0)).div(A0)).mul(100.).abs();
        if(pDiff>=0.001){
            tostop = 0;
        }
    } else {
        tostop = 0;
    }
    return tostop;
}



function RelDielConst_PureIce(t,f){

    var T = t + 273.; // represent temperature in Kelvin
     
    var theta = (300./T) - 1.;

    var B1 = 0.0207;
    var B2 = 1.16e-11;
    var b = 335.;

    var alpha = (0.00504 + 0.0062*theta)*Math.exp(-22.1*theta);
    var betaM;
    var delBeta = Math.exp(-9.963 + 0.0372*(T-273.16));

    var aa= Math.exp(b/T);
    var bb = aa-1.;
    var cc = B1/T;
    var dd = cc * aa / (bb*bb);

    var beta;

    var epsr = 3.1884 + 9.1e-4 *t;

    var freq_ghz = f;

    var betaM = dd  + B2*freq_ghz*freq_ghz;
    var beta = betaM + delBeta;


    var epsi = alpha/freq_ghz + beta*freq_ghz;

    var result = new Array();
    result[0] = epsr;
    result[1] = epsi;
    return result;
}
