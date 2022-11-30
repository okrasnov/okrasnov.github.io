
function doModule2_4(inputs) {

    if (typeof inputs.real_eps2Val != 'undefined') {
        real_eps2 = inputs.real_eps2Val;
    }
    if (typeof inputs.imag_eps2Val != 'undefined') {
        imag_eps2 = -inputs.imag_eps2Val;
    }
    if (typeof inputs.real_eps3Val != 'undefined') {
        real_eps3 = inputs.real_eps3Val;
    }
    if (typeof inputs.imag_eps3Val != 'undefined') {
        imag_eps3 = -inputs.imag_eps3Val;
    }
    if (typeof inputs.incangVal != 'undefined') {
        incang = inputs.incangVal;
    }
    if (typeof inputs.freqVal != 'undefined') {
        freq_ghz = inputs.freqVal;
    }
    if (typeof inputs.quant != 'undefined') {
        quant = inputs.quant;
    }

    

    var d1=[];
    var d2 =[];
    var d3 = [];
    var theta1, h, v;

    document.getElementById('plotTitle').innerHTML = "at a";


    var rhov=Math.Complex(0.,0.);
    var rhoh=Math.Complex(0.,0.);


    var eps1 = Math.Complex(real_eps1, imag_eps1);
    var eps2 = Math.Complex(real_eps2, imag_eps2);
    var eps3 = Math.Complex(real_eps3, imag_eps3);
    
    var j;


    theta1 = incang*Math.PI/180.;

    var lam2 = Math.Complex(0.,0.);
    var d;


    // wave number in medium 2
    lam2 = Math.Complex(0.,1.).mul(20*Math.PI*0.333333333*freq_ghz).mul(eps2.sqrt());

    //console.log("freq_ghz="+freq_ghz.toString());
    //document.getElementById('plotTitle').innerHTML = "freq_ghz="+freq_ghz.toString();

    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    var theta2=Math.Complex(0.,0.), theta3=Math.Complex(0.,0.);
    var rho12h=Math.Complex(0.,0.), rho12v=Math.Complex(0.,0.);
    var rho23h=Math.Complex(0.,0.), rho23v=Math.Complex(0.,0.);
    var a = Math.Complex(0.,0.);
    var one = Math.Complex(1.,0.);

    if ( quant == "reflection_coeff"){
        document.getElementById('plotTitle').innerHTML = "<br/>Reflection Coefficient";
        document.getElementById('yAxisLabel').innerHTML = "Reflection Coefficient Magnitude";
        
        for (var i = 0; i <= 1000; i += 1) {

            d =0.001*i; // thickness in meters


            //theta2 = acos((1-(sqrt(eps1)/sqrt(eps2).*sin(theta1)).^2).^(1/2));
            a = (eps1.sqrt().div(eps2.sqrt())).mul(Math.sin(theta1));
            theta2 = (one.sub(a.mul(a))).sqrt().acos();

            //theta3 = acos((1-(sqrt(eps1)/sqrt(eps3).*sin(theta1)).^2).^(1/2));
            a = (eps1.sqrt().div(eps3.sqrt())).mul(Math.sin(theta1));
            theta3 = (one.sub(a.mul(a))).sqrt().acos();

            //rho12h = (sqrt(eps1).*cos(theta1)-sqrt(eps2).*cos(theta2)) ./ (sqrt(eps1).*cos(theta1) + sqrt(eps2).*cos(theta2));
            rho12h = eps1.sqrt().mul(Math.cos(theta1)).sub( eps2.sqrt().mul(theta2.cos())).div( eps1.sqrt().mul(Math.cos(theta1)).add( eps2.sqrt().mul(theta2.cos())) );
            //rho12v = (sqrt(eps1).*cos(theta2)-sqrt(eps2).*cos(theta1)) ./ (sqrt(eps1).*cos(theta2) + sqrt(eps2)*cos(theta1));
            rho12v = eps1.sqrt().mul(theta2.cos()).sub( eps2.sqrt().mul(Math.cos(theta1))).div( eps1.sqrt().mul(theta2.cos()).add( eps2.sqrt().mul(Math.cos(theta1))) );
    

            //rho23h = (sqrt(eps2).*cos(theta2)-sqrt(eps3).*cos(theta3)) ./ (sqrt(eps2).*cos(theta2) + sqrt(eps3).*cos(theta3));
            rho23h = eps2.sqrt().mul(theta2.cos()).sub( eps3.sqrt().mul(theta3.cos())).div( eps2.sqrt().mul(theta2.cos()).add( eps3.sqrt().mul(theta3.cos())) );
            //rho23v = (sqrt(eps2).*cos(theta3)-sqrt(eps3).*cos(theta2)) ./ (sqrt(eps2).*cos(theta3) + sqrt(eps3)*cos(theta2));
            rho23v = eps2.sqrt().mul(theta3.cos()).sub( eps3.sqrt().mul(theta2.cos())).div( eps2.sqrt().mul(theta3.cos()).add( eps3.sqrt().mul(theta2.cos())) );
    

            //rhoh = (rho12h + rho23h.*exp(-2*lam2.*d.*cos(theta2)))./(1 + rho12h.*rho23h.*exp(-2*lam2.*d.*cos(theta2)));
            rhoh = (rho12h.add( rho23h.mul(lam2.mul(-2.*d).mul(theta2.cos()).exp() ))).div( one.add(rho12h.mul(rho23h).mul(lam2.mul(-2.*d).mul(theta2.cos()).exp()) ));
            //rhov = (rho12v + rho23v.*exp(-2*lam2.*d.*cos(theta2)))./(1 + rho12v.*rho23v.*exp(-2*lam2.*d.*cos(theta2)));
            rhov = (rho12v.add( rho23v.mul(lam2.mul(-2.*d).mul(theta2.cos()).exp() ))).div( one.add(rho12v.mul(rho23v).mul(lam2.mul(-2.*d).mul(theta2.cos()).exp()) ));


            v = rhov.abs();
            h = rhoh.abs();



            d2.push([d, v]);
            d3.push([d, h]);

        }

    } else if (quant == "reflectivity"){
        document.getElementById('plotTitle').innerHTML = "<br/>Reflectivity";
        document.getElementById('yAxisLabel').innerHTML = "Reflectivity";
        
        for (var i = 0; i <= 1000; i += 1) {
            

            d =0.001*i; // thickness in meters


            //theta2 = acos((1-(sqrt(eps1)/sqrt(eps2).*sin(theta1)).^2).^(1/2));
            a = (eps1.sqrt().div(eps2.sqrt())).mul(Math.sin(theta1));
            theta2 = (one.sub(a.mul(a))).sqrt().acos();

            //theta3 = acos((1-(sqrt(eps1)/sqrt(eps3).*sin(theta1)).^2).^(1/2));
            a = (eps1.sqrt().div(eps3.sqrt())).mul(Math.sin(theta1));
            theta3 = (one.sub(a.mul(a))).sqrt().acos();

            //rho12h = (sqrt(eps1).*cos(theta1)-sqrt(eps2).*cos(theta2)) ./ (sqrt(eps1).*cos(theta1) + sqrt(eps2).*cos(theta2));
            rho12h = eps1.sqrt().mul(Math.cos(theta1)).sub( eps2.sqrt().mul(theta2.cos())).div( eps1.sqrt().mul(Math.cos(theta1)).add( eps2.sqrt().mul(theta2.cos())) );
            //rho12v = (sqrt(eps1).*cos(theta2)-sqrt(eps2).*cos(theta1)) ./ (sqrt(eps1).*cos(theta2) + sqrt(eps2)*cos(theta1));
            rho12v = eps1.sqrt().mul(theta2.cos()).sub( eps2.sqrt().mul(Math.cos(theta1))).div( eps1.sqrt().mul(theta2.cos()).add( eps2.sqrt().mul(Math.cos(theta1))) );
    

            //rho23h = (sqrt(eps2).*cos(theta2)-sqrt(eps3).*cos(theta3)) ./ (sqrt(eps2).*cos(theta2) + sqrt(eps3).*cos(theta3));
            rho23h = eps2.sqrt().mul(theta2.cos()).sub( eps3.sqrt().mul(theta3.cos())).div( eps2.sqrt().mul(theta2.cos()).add( eps3.sqrt().mul(theta3.cos())) );
            //rho23v = (sqrt(eps2).*cos(theta3)-sqrt(eps3).*cos(theta2)) ./ (sqrt(eps2).*cos(theta3) + sqrt(eps3)*cos(theta2));
            rho23v = eps2.sqrt().mul(theta3.cos()).sub( eps3.sqrt().mul(theta2.cos())).div( eps2.sqrt().mul(theta3.cos()).add( eps3.sqrt().mul(theta2.cos())) );
    

            //rhoh = (rho12h + rho23h.*exp(-2*lam2.*d.*cos(theta2)))./(1 + rho12h.*rho23h.*exp(-2*lam2.*d.*cos(theta2)));
            rhoh = (rho12h.add( rho23h.mul(lam2.mul(-2.*d).mul(theta2.cos()).exp() ))).div( one.add(rho12h.mul(rho23h).mul(lam2.mul(-2.*d).mul(theta2.cos()).exp()) ));
            //rhov = (rho12v + rho23v.*exp(-2*lam2.*d.*cos(theta2)))./(1 + rho12v.*rho23v.*exp(-2*lam2.*d.*cos(theta2)));
            rhov = (rho12v.add( rho23v.mul(lam2.mul(-2.*d).mul(theta2.cos()).exp() ))).div( one.add(rho12v.mul(rho23v).mul(lam2.mul(-2.*d).mul(theta2.cos()).exp()) ));

            v = rhov.abs();
            h = rhoh.abs();

            v = v*v;
            h = h*h;


            d2.push([d, v]);
            d3.push([d, h]);

        }

    }// endif


    var data_v = {
        color: "rgb(123, 100, 255)",
        label: "<b>v Polarization</b>",
        data: d2
    };

    var data_h = {
        color: "rgb(255, 10, 13)",
         label: "<b>h Polarization</b>",
        data: d3
    };

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 1, tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 1.18,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };
    
    $.plot($("#plotModule2_4"), [ d1, data_v, data_h ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

