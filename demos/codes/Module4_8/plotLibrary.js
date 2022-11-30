
function doModule4_8(inputs) {

    if (typeof inputs.mgVal != 'undefined') {
        mg = inputs.mgVal;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var freq_ghz, f;

    var fmg;
    fmg=0.01*mg;

    var S;
    S = 15.; //% salinity


    //-- free water in leaves
    var sigma_i;

    sigma_i = 0.17*S - 0.0013 * S*S; 

    var ff, rtff;
    var eps_w_r, eps_w_i;
    var eps_b_r, eps_b_i;

    // empirical fits
    var v_fw, v_bw;
    var eps_r;
    v_fw = fmg *( 0.55 * fmg - 0.076);
    v_bw = 4.64 *fmg*fmg /(1. + 7.36 * fmg*fmg); 

    eps_r = 1.7 - 0.74 *fmg + 6.16 * fmg*fmg;




    for (var i = 1; i <= 100; i += 1) {

        freq_ghz = 0.2*i;
        f = freq_ghz;

        //-- free water in leaves
        ff= f/18.;
        eps_w_r = 4.9 + 74.4 /( 1. + ff*ff);
        eps_w_i =  74.4 *ff /( 1. + ff*ff) + 18*sigma_i/f ;

        // bound water in leaves
        ff = f/0.36;
        rtff = Math.sqrt(ff);
        eps_b_r = 2.9 + 55*(1.+ rtff)/( (1.+ rtff)*(1.+ rtff) + ff);
        eps_b_i = 55*rtff/ ( (1.+ rtff)*(1.+ rtff) + ff);

        // empirical fits:
        eps_v_r = eps_r + v_fw * eps_w_r + v_bw *eps_b_r;
        eps_v_i =  v_fw * eps_w_i + v_bw *eps_b_i;

        d2.push([freq_ghz, eps_v_r]);
        d3.push([freq_ghz, eps_v_i]);
        
    }


    var data_r = {
        color: "rgb(123, 100, 255)",
        data: d2
    };

    var data_i = {
        color: "rgb(255, 10, 13)",
        data: d3
    };

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 20, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: 50,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_8r"), [ d1, data_r, d1 ], options);

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 20, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: 50,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_8i"), [ d1, d1, data_i ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
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
