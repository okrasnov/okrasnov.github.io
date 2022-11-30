%% Source: Microwave Radar and Radiometric Remote Sensing, http://mrs.eecs.umich.edu
%% These MATLAB-based computer codes are made available to the remote
%% sensing community with no restrictions. Users may download them and
%% use them as they see fit. The codes are intended as educational tools
%% with limited ranges of applicability, so no guarantees are attached to
%% any of the codes. 
%%
%Code 8.3: Gaseous Attenuation Coefficient

%Description: Code computes the total attenuation (absorption) coefficient
    %due to Oxygen and water vapor at any frequency 1<f<1000GHz,
    %temperature -100<t<50C, pressure 10^-5 mbar < P < 1013 mbar,
    %and water vapor density 0<rho_0<20g/m^3.

%Input Variables
    %T: temperature in in degree C
    %P: total barometric pressure in mbar
    %rho_0: water vapor density in g/m^3
    %f: frequency in GHz
    
%Output Products
    %kappag: gaseous attenuation coefficient in dB/km
    
%Book Reference: Section 8-2.3

%MATLAB Code:

function [kappag]=AttenCoef_Gaseous(T,P,rho_0,f)

%-- calculate atten. due to water vapor
   [kappaH2O]=AttenCoef_WaterVapor(T,P,rho_0,f);

% calculate atten. due to oxygen    
   [kappaO2]=AttenCoef_Oxygen(T,P,rho_0,f);
   
% total atten. in dB/km   
   kappag=kappaH2O+kappaO2;
end


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


%Code 8.2: Attenuation Coefficient of Oxygen

%Description: Code computes the attenuation (absorption) coefficient of
%Oxygen at any frequency 1<f<1000GHz, temperature -100<t<50C
%pressure 10e-5mbar<P<10e13mbar, and water vapor density
%0<rho_0<20<g/m^3

%Input Variables:
    %T: temperature in Celsius
    %P: total barometric pressure in mbar
    %rho_0: water vapor density in g/m^3
    %f: frequency in GHz
%Output Products:
    %kappa02: Oxygen attenuation coefficient in dB/km

%Book Reference: Sections 8-2.3

%Description: Attenuation Coefficient of Oxygen
function [kappaO2]= AttenCoef_Oxygen(T,P,rho_0,f)

    T = T + 273.15; % transform temperature to degrees Kelvin
    
    F=zeros(44,numel(f));
    term=zeros(44,numel(f));    

    %Load Parameters from Parameter List
    load OXYGEN.txt
    v=transpose(OXYGEN(1:44,1));
    a(1:6,:)=transpose(OXYGEN(1:44,[2:7]));
    a(1,:)=a(1,:)*10^-6;

    %Calculate values of computed inputs
    theta=300/T;
    e=rho_0/(0.7223*theta);
    Pd=P-e;
    
    gamma0 = 0.56e-3*P*theta^0.8;
    S0 = 6.14e-5*Pd*theta^2;
    F0 = -f./(f+ 1i*gamma0);
    
    Sn = 1.4e-12*Pd^2*theta^3.5;
    Fn2 = f./(1 + 1.9e-5*f.^1.5);
    
    Nn = S0.*F0 + 1i*Sn*Fn2;

    delta = 0;
%     delta = (a(5,:)+ a(6,:) .* theta) .*P .* theta.^(0.8);
    
    gamma = a(3,:)*10^-3 .*(Pd.*theta.^a(4,:) + 1.10*e*theta);
    
    for ii=1:44
        F(ii,:)=f.*((1-1i*delta)./(v(ii)-f-1i*gamma(ii))-(1+1i*delta)...
            ./(v(ii)+f+ 1i*gamma(ii)));
    end
    
    Sk = (a(1,:)./v).*Pd.*theta^(3).*exp(a(2,:)*(1-theta));

    for ii=1:44
        term(ii,:) = Sk(ii).*F(ii,:);
    end
    Nd2 = imag(sum(term))+imag(Nn);

    kappaO2 = 0.182*f.*Nd2;
end
