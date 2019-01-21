import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";

//form
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NgForm } from '@angular/forms';

@Component ({
    templateUrl: 'tenants.html'
})

export class TenantsComponent implements OnInit {
    constructor(private svc: ApiService, private http: HttpClient, private router: Router){
   //this.svc.printToConsole('Got the Service'); 
  }
    dtOptions: DataTables.Settings = {};
    public tenants:Array<object> = [];
    public tenantsed:Array<object> = [];
    public regMess:"";
    public upMess:"";
  
    public vldDomainMess="";
    public vldFirstNameMess="";
    public vldLastNameMess="";
    public vldAdmUsernameMess="";
    public vldAdmPassMess="";
    public vldAdmRePassMess="";

    public vldUpFirstNameMess="";
    public vldUpLastNameMess="";
    public vldUpAdmUsernameMess="";
    public vldUpAdmPassMess="";
    public vldUpAdmRePassMess="";
     
    ngOnInit(): void {    
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getTenants(); 
    }    
    
    
getTenants(){

function xmlToJson(xml) {
  
      // Create the return object
      var obj = {};

      if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
      }

      // do children
      if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof(obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
      return obj;
};   
       
        let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:retrieveTenants',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"'+ ' xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:retrieveTenants/>'+
               '</soap:Body>'+
            '</soap:Envelope>';

     
    this.http.post(`https://securene.co:9443/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap12Endpoint`,body, options)
     .subscribe((data:  Array<object>) => {
            this.tenantsed = [];
            this.tenants = data; 

            //console.log(this.tenants);

            // Changes XML to JSON

            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            var jsonTenent=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:retrieveTenantsResponse']['ns:return'];

            for (let tenant in jsonTenent){
            //console.log(jsonTenent[tenant]);
            //console.log(jsonTenent[tenant]['ax2905:tenantDomain']['#text']);

            var tenantId = jsonTenent[tenant]['ax2905:tenantId']['#text'];
            var active = jsonTenent[tenant]['ax2905:active']['#text'];
            var domain = jsonTenent[tenant]['ax2905:tenantDomain']['#text'];
            var email = jsonTenent[tenant]['ax2905:email']['#text'];
            var createdDate = jsonTenent[tenant]['ax2905:createdDate']['#text'];
            
             this.tenantsed.unshift({tenantId:tenantId, active:active, domain: domain, email: email, createdDate : createdDate });
            
            }
           
          //console.log(this.tenantsed)
          setTimeout(function(){
            $("#tenantsTable tbody").show();
            $('#tenants-spinner').hide();
            $('#tenantsTable').DataTable();
          },2000);


      },
       (err : HttpErrorResponse) => {                   
           //console.log(err);
           
        }
      );
}


// register Tenant
regTenant(){
  

     if(this.domain == undefined || this.domain == ""){
        this.vldDomainMess="Domain is required!";
        return false;
     }else{
       this.vldDomainMess="";
     }
     if(this.firstName == undefined || this.firstName == ""){
        this.vldFirstNameMess="First Name is required!";
        return false;
     }else{
       this.vldFirstNameMess="";
     }
     if(this.lastName == undefined || this.lastName == ""){
        this.vldLastNameMess="Last Name is required!";
        return false;
     }else{
       this.vldLastNameMess="";
     }
     
     if(this.admUsername == undefined || this.admUsername == ""){
        this.vldAdmUsernameMess="Username is required!";
        return false;
     }else{
       this.vldAdmUsernameMess="";
     }
       
     var passwordregex=/^[\w\W]{8,}$/;
   
    if(!passwordregex.test(this.admPass) || this.admPass == undefined || this.admPass == ""){ 
       this.vldAdmPassMess="Use 8 characters or more for your password!";
       return false;
     }else{
      this.vldAdmPassMess="";
     }
     if(!passwordregex.test(this.admRePass) || this.admRePass == undefined || this.admRePass == ""){ 
       this.vldAdmRePassMess="Use 8 characters or more for your password!";
       return false;
     }else{
      this.vldAdmRePassMess="";
     }
     if(this.admPass != this.admRePass){
       this.vldAdmRePassMess="Passwords do not match!";
       return false;
     }
     //return false;
   
        let httpHeaders = new HttpHeaders({
       'Content-Type': 'application/soap+xml;charset=UTF-8;',
       'Authorization':'Basic YWRtaW46YWRtaW4=',
       'SOAPAction':'urn:addTenant',
       'Accept': 'text/xml'
        });


        let options = {
         headers: httpHeaders,
         'responseType': 'xml',
         }; 
        
        let body='<?xml version="1.0" encoding="UTF-8"?>'+
          '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"'+ ' xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'+
             '<soap:Header/>'+
             '<soap:Body>'+
                '<ser:addTenant>'+
                   '<ser:tenantInfoBean>'+
                      '<xsd:active>true</xsd:active>'+
                      '<xsd:admin>'+this.admUsername.trim()+'</xsd:admin>'+
                      '<xsd:adminPassword>'+this.admPass.trim()+'</xsd:adminPassword>'+
                      '<xsd:email>'+this.emailAddress.trim()+'</xsd:email>'+
                      '<xsd:firstname>'+this.firstName.trim()+'</xsd:firstname>'+
                      '<xsd:lastname>'+this.lastName.trim()+'</xsd:lastname>'+
                      '<xsd:tenantDomain>'+this.domain.trim()+'</xsd:tenantDomain>'+
                   '</ser:tenantInfoBean>'+
                '</ser:addTenant>'+
             '</soap:Body>'+
          '</soap:Envelope>';
          //console.log(body);

this.http.post(`https://securene.co:9443/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap12Endpoint`,body, options)
 .subscribe((data:  Array<object>) => {
           
        
             //console.log(data);
            
             this.regMess="Tenant Successfully Registered";
             $("#regMess").fadeIn('slow');
             setTimeout(function(){
                $("#regMess").fadeOut(1000);
             }, 5000);
             
             //this.getTenants(); 
                
           },
           (err : HttpErrorResponse) => {
                  
                 //console.log(err);
              }
           );


}

// get tenant to be update
getTenantToBeUpdate(domain){
   //alert(domain);
function xmlToJson(xml) {
  
      // Create the return object
      var obj = {};

      if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
      }

      // do children
      if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof(obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
      return obj;
};   
       
        let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:getTenant',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"'+ ' xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:getTenant>'+
                     '<ser:tenantDomain>'+domain+'</ser:tenantDomain>'+
                  '</ser:getTenant>'+
               '</soap:Body>'+
            '</soap:Envelope>';

     
    this.http.post(`https://securene.co:9443/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap12Endpoint`,body, options)
     .subscribe((data:  Array<object>) => {
            
             //console.log(data);
             
            // Changes XML to JSON
            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            //console.log(jsonFromXml);
            var jsonTenent=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:getTenantResponse']['ns:return'];
            console.log(jsonTenent);
            
            var tenantId = jsonTenent['ax2905:tenantId']['#text'];
            var tenantDomain = jsonTenent['ax2905:tenantDomain']['#text'];
            var tenantFirstName = jsonTenent['ax2905:firstname']['#text'];
            var tenantLastName = jsonTenent['ax2905:lastname']['#text'];
            var tenantAdmin = jsonTenent['ax2905:admin']['#text'];
            var tenantEmail = jsonTenent['ax2905:email']['#text']; 

            this.Upid=tenantId;    
            this.Updomain=tenantDomain;
            this.UpfirstName=tenantFirstName;
            this.UplastName=tenantLastName;
            this.UpadmUsername=tenantAdmin;
            this.UpemailAddress=tenantEmail;
       


      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
        }
      );
}

// Update Tenant
updateTenant(){
       //alert(this.UpfirstName);
       //alert(this.UplastName);
    
     if(this.UpfirstName == undefined || this.UpfirstName == ""){
        this.vldUpFirstNameMess="First Name is required!";
        return false;
     }else{
       this.vldUpFirstNameMess="";
     }
     if(this.UplastName == undefined || this.UplastName == ""){
        this.vldUpLastNameMess="Last Name is required!";
        return false;
     }else{
       this.vldUpLastNameMess="";
     }

      if(this.UpadmUsername == undefined || this.UpadmUsername == ""){
        this.vldUpAdmUsernameMess="Username is required!";
        return false;
     }else{
       this.vldUpAdmUsernameMess="";
     }
     
     var passwordregex=/^[\w\W]{8,}$/;
   
    if(!passwordregex.test(this.UpadmPass) || this.UpadmPass == undefined || this.UpadmPass == ""){ 
       this.vldUpAdmPassMess="Use 8 characters or more for your password!";
       return false;
     }else{
      this.vldUpAdmPassMess="";
     }
     if(!passwordregex.test(this.UpadmRePass) || this.UpadmRePass == undefined || this.UpadmRePass == ""){ 
       this.vldUpAdmRePassMess="Use 8 characters or more for your password!";
       return false;
     }else{
      this.vldUpAdmRePassMess="";
     }
     if(this.UpadmPass != this.UpadmRePass){
       this.vldUpAdmRePassMess="Passwords do not match!";
       return false;
     }
  
        let httpHeaders = new HttpHeaders({
       'Content-Type': 'application/soap+xml;charset=UTF-8;',
       'Authorization':'Basic YWRtaW46YWRtaW4=',
       'SOAPAction':'urn:updateTenant',
       'Accept': 'text/xml'
        });


        let options = {
         headers: httpHeaders,
         'responseType': 'xml',
         }; 
        
        let body='<?xml version="1.0" encoding="UTF-8"?>'+
          '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"'+ ' xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'+
             '<soap:Header/>'+
             '<soap:Body>'+
                '<ser:updateTenant>'+
                  '<ser:tenantInfoBean>'+
                      '<xsd:admin>'+this.UpadmUsername+'</xsd:admin>'+
                      '<xsd:adminPassword>'+this.UpadmPass+'</xsd:adminPassword>'+
                      '<xsd:email>'+this.UpemailAddress+'</xsd:email>'+
                      '<xsd:firstname>'+this.UpfirstName+'</xsd:firstname>'+
                      '<xsd:lastname>'+this.UplastName+'</xsd:lastname>'+
                      '<xsd:originatedService></xsd:originatedService>'+
                      '<xsd:successKey></xsd:successKey>'+
                      '<xsd:tenantDomain>'+this.Updomain+'</xsd:tenantDomain>'+
                      '<xsd:tenantId>'+this.Upid+'</xsd:tenantId>'+
                      '<xsd:usagePlan></xsd:usagePlan>'+
                  '</ser:tenantInfoBean>'+
              '</ser:updateTenant>'+
             '</soap:Body>'+
          '</soap:Envelope>';

this.http.post(`https://securene.co:9443/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap12Endpoint`,body, options)
 .subscribe((data:  Array<object>) => {
        
          //console.log(data);
             //this.getTenants();
             this.upMess="Tenant Successfully Updated";
             $("#upMess").fadeIn('slow');
             setTimeout(function(){
                $("#upMess").fadeOut(1000);
             }, 5000);


                
           },
           (err : HttpErrorResponse) => {
                  
                 //console.log(err);
              }
           );

  
}


// deactivate and activate domain
DeAndActivateDomain(domain){
//alert(domain); 
      
        

      if($(event.target).hasClass('btn-danger')){
        $(event.target).removeClass('btn-danger');
        $(event.target).addClass('btn-primary');
        $(event.target).html('Activate');

        let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:deactivateTenant',
           'Accept': 'text/xml'
            });

        let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             }; 

        let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"'+ ' xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:deactivateTenant>'+
                    '<ser:tenantDomain>'+domain+'</ser:tenantDomain>'+
                  '</ser:deactivateTenant>'+
               '</soap:Body>'+
            '</soap:Envelope>';

            
      }else{
       $(event.target).removeClass('btn-primary');
       $(event.target).addClass('btn-danger');
       $(event.target).html('Deactivate');

       let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:activateTenant',
           'Accept': 'text/xml'
            });
            
        let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             }; 

       let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"'+ ' xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:activateTenant>'+
                    '<ser:tenantDomain>'+domain+'</ser:tenantDomain>'+
                  '</ser:activateTenant>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      }
          

     
    this.http.post(`https://securene.co:9443/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap12Endpoint`,body, options)
     .subscribe((data:  Array<object>) => {
            
             //console.log(data);

      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
        }
      );
}




}