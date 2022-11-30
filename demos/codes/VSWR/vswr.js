function showcredit()
{
var credit
credit="Script programmed by Jens T.Saetre 03112000"
credit+="\n08122002 Changed layout"
credit+="\nUpdated 08122002"
window.alert(credit);

//var theResponse = window.prompt("Welcome?","Enter your name here.");
}


function log10(X)
{
return( Math.log(X)/Math.log(10)  );
// works OK !
}


function main()
{
var InputPower,ReflectedPower,OutputPower

document.VSWRFORM.LOSS_PERCENT.value=formatvalue(Loss_Percent(), 5);
document.VSWRFORM.LOSS_DB.value= formatvalue( Loss_dB(), 5);
InputPower=1*document.VSWRFORM.InputPowerW.value;
OutputPower=10*log10(Output_Power());
ReflectedPower=InputPower- Output_Power();
document.VSWRFORM.ReflectedPower.value= formatvalue( 10*log10(ReflectedPower)+30, 5);
document.VSWRFORM.OutputPower.value= formatvalue(OutputPower+30, 5);
//document.VSWRFORM.InputPowerW.value=     formatvalue(   Math.pow(10,((InputPower)/10)), 5);
document.VSWRFORM.ReflectedPowerW.value= formatvalue(ReflectedPower, 5);
document.VSWRFORM.OutputPowerW.value=  formatvalue(Output_Power(), 5);




//window.prompt(Output_Power(),"Enter your name here.");

}


function OnChangeOutputPower()
{
var InputPower,OutputPower,ReflectedPower,vswr
InputPower=1*document.VSWRFORM.InputPowerW.value; 
OutputPower=1*document.VSWRFORM.OutputPowerW.value;
document.VSWRFORM.OutputPower.value= formatvalue(10*log10(OutputPower)+30, 5);
ReflectedPower=InputPower-OutputPower;
document.VSWRFORM.ReflectedPowerW.value= formatvalue(ReflectedPower, 5);
document.VSWRFORM.ReflectedPower.value= formatvalue((10*log10(ReflectedPower)+30), 5);


vswr= ( 1+ Math.sqrt(ReflectedPower/OutputPower) )/ ( 1 - Math.sqrt(ReflectedPower/OutputPower) );
document.VSWRFORM.VSWR.value=formatvalue(vswr, 5);

document.VSWRFORM.LOSS_PERCENT.value=formatvalue(Loss_Percent(), 5);
document.VSWRFORM.LOSS_DB.value= formatvalue( Loss_dB(), 5);


}

function OnChangeReflectedPower()
{
var InputPower,OutputPower,vswr
InputPower=1*document.VSWRFORM.InputPowerW.value; 
ReflectedPower=1*document.VSWRFORM.ReflectedPowerW.value;
OutputPower=InputPower-ReflectedPower;
document.VSWRFORM.OutputPowerW.value= formatvalue(OutputPower, 5);

document.VSWRFORM.OutputPower.value= formatvalue(((10*log10(OutputPower))+30), 5);


document.VSWRFORM.ReflectedPower.value=formatvalue((10*log10(ReflectedPower)+30), 5);
vswr= ( 1+ Math.sqrt(ReflectedPower/OutputPower) )/ ( 1 - Math.sqrt(ReflectedPower/OutputPower) );
document.VSWRFORM.VSWR.value=formatvalue(vswr, 5);
//window.prompt(vswr,"Enter your name here.");

document.VSWRFORM.LOSS_PERCENT.value=formatvalue(Loss_Percent(), 5);
document.VSWRFORM.LOSS_DB.value= formatvalue( Loss_dB(), 5);


}


function OnReflectedPowerdBm()
{
var ReflectedPowerdBm,ReflectedPower
ReflectedPowerdBm=1*document.VSWRFORM.ReflectedPower.value;

ReflectedPower=Math.pow(10,((ReflectedPowerdBm-30)/10) );
document.VSWRFORM.ReflectedPowerW.value=formatvalue( ReflectedPower, 5);

}


function OnOutputPowerdBm()
{
var OutputPowerdBm,OutputPower
OutputPowerdBm=1*document.VSWRFORM.OutputPower.value;

OutputPower=Math.pow(10,((OutputPowerdBm-30)/10) );
document.VSWRFORM.OutputPowerW.value=formatvalue( OutputPower, 5);

}




function OnChangeLossdB()
{
var vswr,loss_dB,loss_percent,factor

loss_dB=1*document.VSWRFORM.LOSS_DB.value;

loss_percent=100*(1- Math.pow(10, (-loss_dB/10)));

factor=Math.sqrt(loss_percent/100);

vswr= (factor+1)/(1-factor);

document.VSWRFORM.VSWR.value=formatvalue(vswr, 5);

}


function OnChangeLossPercent()
{
var vswr,loss_dB,loss_percent,factor
loss_percent=1*document.VSWRFORM.LOSS_PERCENT.value;
factor=Math.sqrt(loss_percent/100);
vswr= (factor+1)/(1-factor);
document.VSWRFORM.VSWR.value=formatvalue(vswr, 5);
}



function Loss_Percent()
{
var vswr,loss
vswr=1*document.VSWRFORM.VSWR.value;
loss=100* Math.pow(  (  (vswr-1)/(vswr+1)  ),2   );
return(loss);

}

function Output_Power()
{
var vswr,VSWRfactor,InputPower
vswr=1*document.VSWRFORM.VSWR.value;
VSWRfactor=Math.pow(  (  (vswr-1)/(vswr+1)  ),2   );
InputPower=1*document.VSWRFORM.InputPowerW.value;
return(InputPower/(1+VSWRfactor));
}


function Loss_dB()
{
return(-10*log10(1-(Loss_Percent()/100)));
}

function To_Watt(PowerdBm)
{
return(Math.pow( (PowerdBm/10),10)  );
}

function To_dBm(Power)
{
return(10*log10(Power)+30);
}

function To_Watt(Power)
{
return(Math.pow(10, (Power/10)));
}

function Convert_To_dBm()
{
var ReflectedPower,InputPower,OutputPower
InputPower=1*document.VSWRFORM.InputPowerW.value;
OutputPower=1*document.VSWRFORM.ReflectedPowerW.value;
ReflectedPower=1*document.VSWRFORM.ReflectedPowerW.value;
document.VSWRFORM.InputPower.value=formatvalue((10*log10(InputPower)+30), 5);
document.VSWRFORM.ReflectedPower.value= formatvalue((10*log10(ReflectedPower)+30), 5);
document.VSWRFORM.OutputPower.value= formatvalue((10*log10(OutputPower)+30), 5);

}


function Convert_To_Watt()
{
var InputPower,InputPowerW
InputPower=1*document.VSWRFORM.InputPower.value;
InputPowerW=To_Watt(InputPower-30);
document.VSWRFORM.InputPowerW.value=formatvalue((InputPowerW), 5);
}


function formatvalue(input, rsize) // Desimal avrunding
  {
   var invalid = "**************************";
   var nines = "999999999999999999999999";
   var strin = "" + input;
   var fltin = parseFloat(strin);
   if (strin.length <= rsize) return strin;
   if (strin.indexOf("e") != -1 ||
       fltin > parseFloat(nines.substring(0,rsize)+".4"))
      return invalid.substring(0, rsize);
   var rounded = "" + (fltin + (fltin - parseFloat(strin.substring(0, rsize))));
   return rounded.substring(0, rsize);
}