%% Source: Microwave Radar and Radiometric Remote Sensing, http://mrs.eecs.umich.edu
%% These MATLAB-based computer codes are made available to the remote
%% sensing community with no restrictions. Users may download them and
%% use them as they see fit. The codes are intended as educational tools
%% with limited ranges of applicability, so no guarantees are attached to
%% any of the codes. 
%%
%Code 8.1: Attenuation Coefficient of Water Vapor

%Description: Code computes the attenuation (absorption) coefficient of
%water vapor at any frequency 1<f<1000GHz, temperature -100<t<50C
%pressure 10e-5mbar<P<1013mbar, and water vapor density
%0<rho_0<20<g/m^3
%Input Variables:
    %T: temperature in Celsius
    %P: total barometric pressure in mbar
    %rho_0: water vapor density in g/m^3
    %f: frequency in GHz
%Output Products:
    %kappaH20: water vapor attenuation coefficient in dB/km

%Book Reference: Sections 8-2.3

%MATLAB Code:

function [kappaH2O]=AttenCoef_WaterVapor(T,P,rho_0,f)

    T = T + 273.15; % transform temperature to degrees Kelvin
    
    F=zeros(34,numel(f));
    term=zeros(34,numel(f));

    %Load Parameters from Parameter List
    load WATER.txt
    v=transpose(WATER(1:34,1));
    b([1:6],:)=transpose(WATER(1:34,[2:7]));

    %Calculate values of computed inputs
    theta=300/T;
    e=rho_0/(0.7223*theta);
    Pd= P - e;
    
    ks=0.444*theta^(7.5);
    kf=0.0145*theta^(4.5);
    Nc2 = e*(ks*e+kf*Pd)*10^-6.*f;

    delta = 0;
    
    gamma = b(3,:)*10^-3 .*(b(4,:).*e.*theta.^b(6,:) + Pd.*theta.^b(5,:));
    
    for ii=1:34
        F(ii,:)=f.*((1 -1i*delta)./(v(ii) -f -1i*gamma(ii))-(1+1i*delta)...
            ./(v(ii) + f +1i*gamma(ii)));
    end
    
    Sl = (b(1,:)./v).*e.*theta^(3.5).*exp(b(2,:)*(1-theta));

    for ii=1:34
        term(ii,:) = Sl(ii).*F(ii,:);
    end
    
    Nv2 = imag(sum(term))+Nc2;

    kappaH2O = 0.182*f.*Nv2;
end
