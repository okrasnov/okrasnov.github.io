
function doModule4_4(inputs) {

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
    if (typeof inputs.quant != 'undefined') {
        quant = inputs.quant;
    }

    

    var d1=[];
    var d2 =[];
    var d3 = [];

    var epsi=Math.Complex(0.,0.);
    var epsh=Math.Complex(0.,0.);
    var epsm=Math.Complex(0.,0.);


    epsi.re = real_eps1;
    epsi.im = imag_eps1;
    epsh.re = real_eps2;
    epsh.im = imag_eps2;
    
    var vi;

    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    if ( quant == "spherical"){
        
        //document.getElementById('plotTitle').innerHTML = "at a";

        for (var i = 0; i <= 100; i += 1) {

            vi = 0.01*i;
            //eps_m = eps_h + 3*vi*eps_h*(eps_i -eps_h)./((2*eps_h+eps_i)-vi*(eps_i-eps_h));

            epsm = epsh.add(epsh.mul(3.*vi).mul(epsi.sub(epsh)).div( (epsh.mul(2.).add(epsi)).sub((epsi.sub(epsh)).mul(vi))));

            d2.push([vi, epsm.re]);
            d3.push([vi, -epsm.im]);

        }

    } else if (quant == "disc"){
        
        //document.getElementById('plotTitle').innerHTML = "at b";
        for (var i = 0; i <= 100; i += 1) {

            vi = 0.01*i;

            //eps_m = eps_h + vi/3*(eps_i - eps_h)*(2*eps_i*(1-vi)+eps_h*(1+2*vi))./(vi*eps_h +(1-vi)*eps_i);
            epsm = epsh.add((epsi.sub(epsh)).mul(vi/3.).mul(epsi.mul(2.*(1.-vi)).add(epsh.mul(1.+2.*vi))).div((epsh.mul(vi)).add(epsi.mul(1.-vi))));

            d2.push([vi, epsm.re]);
            d3.push([vi, -epsm.im]);
        }

    } else if (quant == "needle"){
        
        //document.getElementById('plotTitle').innerHTML = "at c";
        for (var i = 0; i <= 100; i += 1) {

            vi = 0.01*i;

            //eps_m = eps_h + vi/3*(eps_i-eps_h)*(eps_h*(5+vi)+(1-vi)*eps_i)./(eps_h*(1+ vi)+eps_i*(1-vi));
            epsm = epsh.add(epsi.sub(epsh).mul(vi/3.).mul( (epsi.mul(1.-vi)).add(epsh.mul(5.+vi)) ).div( (epsh.mul(1.+vi)).add(epsi.mul(1.-vi))));

            d2.push([vi, epsm.re]);
            d3.push([vi, -epsm.im]);


       }
    }

    var data_r = {
        color: "rgb(123, 100, 255)",
        label: "<b>Real Part</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
        data: d2
    };

    var data_i = {
        color: "rgb(255, 10, 13)",
        label: "<b>Imaginary Part</b>",
        data: d3
    };

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 1, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: 118,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_4r"), [ d1, data_r, d1 ], options);

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 1, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: 118,
        //         tickFormatter: yAxisLabeller },

    };
    
    $.plot($("#plotModule4_4i"), [ d1, d1, data_i ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

