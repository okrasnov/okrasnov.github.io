
function doModule11_4(inputs) {

    if (typeof inputs.densityVal != 'undefined') {
        density = inputs.densityVal;
    }
    if (typeof inputs.radiusVal != 'undefined') {
        radius = inputs.radiusVal;
    }
    if (typeof inputs.wetnessVal != 'undefined') {
        wetness = inputs.wetnessVal;
    }
    if (typeof inputs.quant != 'undefined') {
        quant = inputs.quant;
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

            bb = MieExtinc_WetSnow(density,radius,freq,wetness);

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
    $.plot($("#plotModule11_4"), [ data_ka, data_ks, data_ke, data_aa], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(5) + "</span>";
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





//**********************************************************************
function  MieExtinc_WetSnow(rho_s,ri,f,mvin) {

    var mv= mvin/100.; // transform from percentage to absolute.
    var t = 0; //set temperature to 0 degree C.

    var rho_i = 0.9167; //density of ice (g /cm3)

    //- calculate relative dielectric constant of pure ice
    var eps_v=[];
    eps_v = RelDielConst_PureIce(t,f);
    var eps_sp=Math.Complex(eps_v[0],-eps_v[1]);

    //- calculate the relative dielectric constant of water 
    var epsw_v=[];
    epsw_v = RelDielConst_PureWater(t,f);
    var eps_w=Math.Complex(epsw_v[0],-epsw_v[1]);

    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>eps:"+eps_sp+", "+eps_w;
    //}


    //- Calculating the effective dielectric constant of the wet-air medium
    //(i.e. the background medium of wet snow):

    //according to the mixing formula of water/air mixture (eq: 11.114), and
    //assuming that the depolarization factors are given as Aa = Ab = 0.06, and
    //Ac = 0.88, then the mixing formula of the effective dielectric constant of
    //the background medium, eps_b, reduces to third order polynomial: 
    //   a *eps_b^3 + b*eps_b^2 + c*eps_b + d = 0:

    var Aa = 0.06; 
    var Ac = 0.88;

    var c3 = 1. - Ac - Aa + Ac * Aa; //(1-Aa)*(1-Ac);

    var c1 = Math.Complex(0.,0.);
    var c2 = Math.Complex(0.,0.);
    var a1 = Math.Complex(0.,0.);
    var a2 = Math.Complex(0.,0.);
    var B  = Math.Complex(0.,0.);

    var c2 = eps_w.mul(Ac + Aa - 2.* Ac*Aa); //eps_w*( (1-Ac)*Aa+(1-Aa)*Ac ); 
    var c1 = eps_w.mul(eps_w).mul(Aa * Ac);
    var a1 = eps_w.mul( 2.*Ac + Aa); //(2*Ac*+ Aa)*eps_w;
    var a2 = (3. - 2.*Ac - Aa); //(2*(1-Ac)+(1-Aa));
    var B = (eps_w.sub(1.)).mul(mv*0.333333);

    //-next we cast the polynomial coefficient into a vector (X) and use the matlab
    //function roots to retrieve the 3 different roots of the equation

    //if(f < 3.01){
    //   document.getElementById('debug').innerHTML = "<br/>c1="+c1+"  c2="+c2+"  c3="+c3+"  a1="+a1+"  a2="+a2+"  B="+B+"  mv="+mv;
    //}


    var X1 = Math.Complex(c3,0.0); // note these coefficients are complex numbers.
    //X(2) = c2 - c3 - B * a2;
    var X2 = c2.sub(c3).sub(B.mul(a2));
    //X(3) = c1 - c2 - B*a1;
    var X3 = c1.sub(c2).sub(B.mul(a1));
    var X4 = c1.mul(-1.0);

    //if(f < 3.01){
    //   document.getElementById('debug').innerHTML = "<br/>X1="+X1+"  X2="+X2+"  X3="+X3+"  X4="+X4;
    //}

    var rt_b =[]; // get 3 complex roots
    rt_b = getCubicRoots(X1, X2, X3, X4, f);

    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>roots: "+rt_b[0]+", "+rt_b[1]+", "+rt_b[2];
    //}


    //- which root to select?
    //-now we need to discard the roots with negative real parts. Set the root to
    //very large quantity. Then we select the roots with the smallest absolute
    //value.

    // the following is simple testing to verify that the roots are indeed
    // correct values.
    // x = -rt_b(1) + 1 + mv/3.*(eps_w-1).* ( 2./(1 + Aa*(eps_w./rt_b(1)-1)) + ...
    //     1./(1 + Ac.*(eps_w./rt_b(1)-1)))
    // 
    // x = -rt_b(2) + 1 + mv/3.*(eps_w-1).* ( 2./(1 + Aa*(eps_w./rt_b(2)-1)) + ...
    //     1./(1 + Ac.*(eps_w./rt_b(2)-1)))
    // 
    // x = -rt_b(3) + 1 + mv/3.*(eps_w-1).* ( 2./(1 + Aa*(eps_w./rt_b(3)-1)) + ...
    //     1./(1 + Ac.*(eps_w./rt_b(3)-1))) 
    // 
    // 
    // y = X(1)*rt_b(1)^3 + X(2)*rt_b(1)^2 + X(3)*rt_b(1) + X(4)
    // 
    // y = X(1)*rt_b(2)^3 + X(2)*rt_b(2)^2 + X(3)*rt_b(2) + X(4)
    // 
    // y = X(1)*rt_b(3)^3 + X(2)*rt_b(3)^2 + X(3)*rt_b(3) + X(4)

    var rtmin;
    var eps_b = Math.Complex(0.,0.);
    for(ii=0;ii<3;ii++){
        if ( rt_b[ii].re  < 0.0 ) {
            rt_b[ii] = Math.Complex(1.0e6,0.0);
        }
        if(ii==0) {
            rtmin = rt_b[0].norm();
            eps_b = rt_b[0];
        }
        if( rt_b[ii].norm() < rtmin) {
            rtmin = rt_b[ii].norm()
            eps_b = rt_b[ii];
        }
    }// endfor

    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>rtmin: "+rtmin+"  eps_b: "+eps_b;
    //}


    //  eps_b1 = mv/3 *(eps_w - 1) + 1; %crude approximation
    // 
    // eps_b2 = TVBmodel_HeterogeneousMix(eps_w, 1, 1, mv); %Using TVB model
    // (approximate solution)
    // 
    // eps_b3 = eps_w*(1+ 2/3*mv*(eps_w -1)) ./(eps_w-mv/3*(eps_w-1)); %using
    // the disk approximation of water droplet shape in Polder Van Santen
    // formula 
    //

    //-- calculate the Mie efficiencies using Code 8.12
    // [Es Ea Ee Eb t1 t2 t3 t4] = ...
    //    Mie_Rayleigh_ScatteringOfSpheres(ri, f, eps_sp, eps_b); 

    var bb=[];
    bb = mie(eps_sp.re, eps_sp.im, eps_b.re, 0.0, ri, f);
    var Ea=bb[0];
    var Es=bb[1];
    var Ee=bb[2];
    var Eb=bb[3];

    var area = Math.PI * ri*ri;

    var Qs = Es * area;
    var Qa = Ea * area;
    var Qe = Ee * area;

    var vi = rho_s /rho_i;
    var Nv = vi /(4./3. * area*ri);

    //coefficients due to the scatters:
    var kappa_ai = Nv * Qa;
    var kappa_s  = Nv * Qs; 



    // kappa_e = Nv .* Qe;

    //-absorption by the background
    var kappa_ab = 2.* (2.*Math.PI*f/0.3) *(1.-vi) * Math.abs((eps_b.sqrt()).im);

    var kappa_a = kappa_ai + kappa_ab; //total absorption

    var kappa_e = kappa_s + kappa_a; // total extinction

    var a = kappa_s /kappa_e; //albedo

    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>kappa_s: "+kappa_s+"  kappa_e: "+kappa_e;
    //}


    var result = new Array();
    result[0] = kappa_a;
    result[1] = kappa_s;
    result[2] = kappa_e;
    result[3] = a;
    return result;
}



//*********************************************************
function getCubicRoots_ORIGINAL(X1,X2,X3,X4){
    // coefficient represent the equation:
    // X1*x^3 + X2*x^2 + X3*x + X4 =0
    // everything is complex.

    var p = X2.div(X1);
    var q = X3.div(X1);
    var r = X4.div(X1);

    var a1 = p.mul(p).mul(q).mul(q).mul(-1.);
    var a2 = q.mul(q).mul(q).mul(4.);
    var a3 = p.mul(p).mul(p).mul(r).mul(4.);
    var a4 = p.mul(q).mul(r).mul(-18.);
    var a5 = r.mul(r).mul(27.);
    var a0 = (a1.add(a2).add(a3).add(a4).add(a5)).sqrt();

    var b1 = p.mul(p).mul(p).mul(-2.);
    var b2 = p.mul(q).mul(9.);
    var b3 = r.mul(-27.);
    var b4 = a0.mul(3.*Math.sqrt(3.));
    var b0 = (b1.add(b2).add(b3).add(b4)).pow(0.333333333);

    var c1 = 3.*Math.pow(2.,0.333333333);
    var A = b0.div(c1);

    var d1 = p.mul(p).mul(p).mul(-1.);
    var d2 = q.mul(3.);
    var d3 = A.mul(9.);
    var B = (d1.add(d2)).div(d3);

    var half_root3  = 0.5*Math.sqrt(3.);
    var scale_plus  = Math.Complex(-0.5,half_root3);
    var scale_minus = Math.Complex(-0.5,-half_root3);

    var x1 = (p.mul(-0.3333333)).add(A).sub(B);
    var x2 = (p.mul(-0.3333333)).add(A.mul(scale_minus)).sub(B.mul(scale_plus));
    var x3 = (p.mul(-0.3333333)).add(A.mul(scale_plus)).sub(B.mul(scale_minus));
    
    var result = new Array();
    result[0] = x1;
    result[1] = x2;
    result[2] = x3;
    return result;
}

//*********************************************************
function getCubicRoots_TRY1(X1,X2,X3,X4,f){
    // coefficient represent the equation:
    // X1*x^3 + X2*x^2 + X3*x + X4 =0
    // everything is complex.

    var p = X2.div(X1);
    var q = X3.div(X1);
    var r = X4.div(X1);


    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>p="+p+" q="+q+"   r="+r;
    //}


    var a = q.sub( p.mul(p).mul(0.333333) );
    var b1 = p.mul(p).mul(p).mul(2.);
    var b2 = p.mul(q).mul(-9.);
    var b3 = r.mul(27.);
    var b4  = b1.add(b2).add(b3);
    var b   = b4.mul(1./27.);

    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>a="+a+" b1="+b1+"   b2="+b2+"   b3="+b3+"   b4="+b4+"   b="+b;
    //}
    //var gg1 = p.mul(p);
    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>gg1="+gg1;
    //}



    var A1 = b.mul(-0.5);
    var A2 = b.mul(b).mul(.25);
    var A3 = a.mul(a).mul(a).mul(1./27.);
    var A4 = A2.add(A3);
    var A5 = A4.pow(0.5);
    var A6 = A1.add(A5);
    var A  = A6.pow(0.3333333333);

    var B6 = A1.sub(A5);
    var B  = B6.pow(0.3333333333);

    var ApB = A.add(B);
    var AmB = A.sub(B);


    var half_root3  = 0.5*Math.sqrt(3.);
    var aa = Math.Complex(0.,half_root3);
    var ya = ApB.mul(-0.5);
    var yb = AmB.mul(aa);

 
    var xx1 = (p.mul(-0.3333333)).add(ApB);
    var xx2 = (p.mul(-0.3333333)).add(ya).add(yb);
    var xx3 = (p.mul(-0.3333333)).add(ya).sub(yb);



    //if(f < 3.01){
    //    document.getElementById('debug').innerHTML = "<br/>a="+a+" b="+b+"   A="+A+"  B="+B+"  x1="+x1;
    //}




    
    var result = new Array();
    result[0] = xx1;
    result[1] = xx2;
    result[2] = xx3;
    return result;
}
//*********************************************************
function getCubicRoots(X1,X2,X3,X4,f){
    // coefficient represent the equation:
    // X1*x^3 + X2*x^2 + X3*x + X4 =0
    // everything is complex.

    var p = X3.div(X1).sub( X2.mul(X2).div( X1.mul(X1).mul(3.)));

    var q1=X2.mul(X2).mul(X2).mul(2.);
    var q2=X1.mul(X1).mul(X1).mul(27.);
    var q3 = X4.div(X1);
    var q4 = X2.mul(X3);
    var q5= X1.mul(X1).mul(3.);
    var qa1 = q1.div(q2);
    var qa2=q4.div(q5);
    var q = qa1.add(q3).sub(qa2);

    var det1 = q.mul(q).mul(0.25);
    var det2 = p.mul(p).mul(p).mul(1./27.);
    var det  = det1.add(det2);

    var sdet = det.sqrt();

    var v = q.mul(-0.5).add(sdet);

    var uvec = new Array();
    uvec = cuberoot(v);
    u = uvec[0];
    u1 = uvec[1];
    u2 = uvec[2];



    var w = q.mul(-0.5).sub(sdet);

    var vvec = new Array();
    vvec = cuberoot(w);
    v = vvec[0];
    v1 = vvec[1];
    v2 = vvec[2];

    var ppp=X2.div( X1.mul(3.) );

    var z1=u.add(v).sub(ppp);
    var z2=u.add(v1).sub(ppp);
    var z3=u.add(v2).sub(ppp);
    var z4=u1.add(v).sub(ppp);
    var z5=u1.add(v1).sub(ppp);
    var z6=u1.add(v2).sub(ppp);
    var z7=u2.add(v).sub(ppp);
    var z8=u2.add(v1).sub(ppp);
    var z9=u2.add(v2).sub(ppp);

    var absf = new Array();
    absf[0]= thefunc(X1,X2,X3,X4,z1);
    absf[1]= thefunc(X1,X2,X3,X4,z2);
    absf[2]= thefunc(X1,X2,X3,X4,z3);
    absf[3]= thefunc(X1,X2,X3,X4,z4);
    absf[4]= thefunc(X1,X2,X3,X4,z5);
    absf[5]= thefunc(X1,X2,X3,X4,z6);
    absf[6]= thefunc(X1,X2,X3,X4,z7);
    absf[7]= thefunc(X1,X2,X3,X4,z8);
    absf[8]= thefunc(X1,X2,X3,X4,z9);


    var result = new Array();

    var ii;
    var themin = absf[0];
    var themini = 0;
    for(ii=0;ii<9;ii++){
        if(absf[ii] < themin){
            themin = absf[ii];
            themini = ii;
        }
    }
    if(themini==0){
        result[0]=z1;
    }else if(themini==1){
        result[0]=z2;
    }else if(themini==2){
        result[0]=z3;
    }else if(themini==3){
        result[0]=z4;
    }else if(themini==4){
        result[0]=z5;
    }else if(themini==5){
        result[0]=z6;
    }else if(themini==6){
        result[0]=z7;
    }else if(themini==7){
        result[0]=z8;
    }else if(themini==8){
        result[0]=z9;
    }

    var themini1 = themini;








    var setit =0;
    for(ii=0;ii<9;ii++){
        if(setit==0 && ii != themini1) {
            themin = absf[ii];
            themini = ii;
            setit=1;
        }
    }

    for(ii=0;ii<9;ii++){
        if(ii != themini1) {
            if(absf[ii] < themin){
                themin = absf[ii];
                themini = ii;
            }
        }
    }
    if(themini==0){
        result[1]=z1;
    }else if(themini==1){
        result[1]=z2;
    }else if(themini==2){
        result[1]=z3;
    }else if(themini==3){
        result[1]=z4;
    }else if(themini==4){
        result[1]=z5;
    }else if(themini==5){
        result[1]=z6;
    }else if(themini==6){
        result[1]=z7;
    }else if(themini==7){
        result[1]=z8;
    }else if(themini==8){
        result[1]=z9;
    }

    var themini2 = themini;

    var setit =0;
    for(ii=0;ii<9;ii++){
        if(setit==0 && ii != themini1 && ii != themini2) {
            themin = absf[ii];
            themini = ii;
            setit=1;
        }
    }

    for(ii=0;ii<9;ii++){
        if(ii != themini1 && ii != themini2) {
            if(absf[ii] < themin){
                themin = absf[ii];
                themini = ii;
            }
        }
    }
    if(themini==0){
        result[2]=z1;
    }else if(themini==1){
        result[2]=z2;
    }else if(themini==2){
        result[2]=z3;
    }else if(themini==3){
        result[2]=z4;
    }else if(themini==4){
        result[2]=z5;
    }else if(themini==5){
        result[2]=z6;
    }else if(themini==6){
        result[2]=z7;
    }else if(themini==7){
        result[2]=z8;
    }else if(themini==8){
        result[2]=z9;
    }

    return result;
}

//*******************************************************************
function cuberoot(z) {

    //Complex z,z1,z2,z3  
    var r=z.abs();
    var t;
    r=Math.pow(r,1./3.);
    if (Math.abs(z.re)<1.E-15) {
        if (z.im < 0.) {
            t = -Math.PI/2.;
        } else  {
            t = Math.PI/2.;
        }
    } else {	    
        //  return t between -pi and +pi
        t=myatan1(z.im,z.re);
    }

    t=t/3.;
    var z1=Math.Complex(r*Math.cos(t),r*Math.sin(t));
    var tt=t-(2.*Math.PI/3.);
    var z2=Math.Complex(r*Math.cos(tt),r*Math.sin(tt));
    tt=t+(2.*Math.PI/3.);
    var z3=Math.Complex(r*Math.cos(tt),r*Math.sin(tt));

    var result = new Array();
    result[0] = z1;
    result[1] = z2;
    result[2] = z3;
    return result;
}

//*******************************************************************
function myatan1(numerator, denominator) {
    // Return a phase between -PI and +PI
    if (Math.abs(denominator) < 1.E-15) {
        if (numerator < 0.0) {
            result = -Math.PI/2.0;
        } else  {
            result = Math.PI/2.0;
        }
    } else {
        phase=Math.atan(numerator/denominator);
        if (denominator < 0.0)  phase = phase + Math.PI;
	result =  phase;
    }
    return result;
}
//*******************************************************************
function thefunc(a,b,c,d,z) {
    var za1 = a.mul(z).mul(z).mul(z);
    var za2 = b.mul(z).mul(z);
    var za3 = c.mul(z);
    var z1 = za1.add(za2).add(za3).add(d);
    return z1.abs();
}

//*******************************************************************
function RelDielConst_PureWater(t,f) {
    
    var freq_ghz;

    var epsS;
    var epsOne=[];
    var tau1=[];
    var tau2=[];
    var epsInf =[];

    var b1=[];
    var b2=[];
    var one=[];
    one[0]=1.;
    one[1]=0.;

    var eps=[];
    var epsi, epsr;


    var a=[0.63000075e1, 0.26242021e-2, 0.17667420e-3, 0.58366888e3, 0.12634992e3,  0.69227972e-4, 0.30742330e3, 0.12634992e3, 0.37245044e1, 0.92609781e-2];

     
    freq_ghz = f;


        epsS = 87.85306*Math.exp(-0.00456992*t);

        epsOne = a[0]*Math.exp(-a[1]*t);

        tau1 = a[2]*Math.exp(a[3]/(t+a[4]));


        tau2 = a[5]*Math.exp(a[6]/(t+a[7]));

        epsInf = a[8] + a[9]*t;



        b1[0]=1.;
        b1[1]=-2.*Math.PI*freq_ghz*tau1;
        b2[0]=1.;
        b2[1]=-2.*Math.PI*freq_ghz*tau2;



        //Permitivity Calculation
        //eps = ((epsS-epsOne)./(1-j*2*pi.*f.*tau1)) + ((epsOne-epsInf)./(1-j*2*pi.*f.*tau2)) + (epsInf);
        eps = crmult(cdiv(one,b1),epsS-epsOne);
        eps = cadd(eps, crmult(cdiv(one,b2),epsOne-epsInf));
        eps[0] = eps[0] + epsInf; 

    var result = new Array();
    result[0] = eps[0];
    result[1] = eps[1];
    return result;

}
