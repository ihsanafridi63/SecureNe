import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";

//form
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NgForm } from '@angular/forms';

@Component ({
    templateUrl: 'users.html'
})

export class UsersComponent implements OnInit {

    constructor(private svc: ApiService, private http: HttpClient, private router: Router){
   //this.svc.printToConsole('Got the Service'); 
  }
    form: FormGroup;
    dtOptions: DataTables.Settings = {};
    public users:Array<object> = [];
    public usersed:Array<object> = [];
    public roles:Array<object> = [];
    public AssignRoles:Array<object> = [];
    public userRoless:Array<object> = [];
    public RoleUsername= "";
    public reg:Array<object> = [];
    public vldUsernameMess="";
    public vldFirstNameMess="";
    public vldLastNameMess="";
    public vldUpFirstNameMess="";
    public vldUpLastNameMess="";
    public delUser="";
    //public roledd = true;

    ngOnInit(): void{
        
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getUsers();
        this.getRoles();
        this.getAssignRoles();    
    }    
    
    
getUsers(){
       
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
          }else{
            if (typeof(obj[nodeName].push) == "undefined"){
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
           'SOAPAction':'urn:listUsers',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:listUsers>'+
                     '<ser:filter>*</ser:filter>'+
                     '<ser:maxItemLimit>10</ser:maxItemLimit>'+
                  '</ser:listUsers>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body);
    this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            this.usersed = [];
            this.users = data; 

           // console.log(data);

            // Changes XML to JSON
 
            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            var jsonUser=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:listUsersResponse']['ns:return'];
            for (let user in jsonUser){
             //console.log(jsonUser[user]['#text']);
             var username = jsonUser[user]['#text'];
             this.usersed.unshift({username:username});
            
            }
           
          //console.log(this.usersed)
          setTimeout(function(){
            $("#usersTable tbody").show();
            $('#users-spinner').hide();
            $('#usersTable').DataTable();
          },2000);

      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
           //console.log('errrr');  
        }
      );

}

getRoles() {

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
          }else{
            if (typeof(obj[nodeName].push) == "undefined"){
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
           'SOAPAction':'urn:getRoleNames',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:getRoleNames/>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body);
    this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            this.roles = [];
          
            //console.log(data);
            
            // Changes XML to JSON
 
            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            //console.log(jsonFromXml);
            var jsonRoles=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:getRoleNamesResponse']['ns:return'];
            //console.log(jsonRoles);
            for (let role in jsonRoles){
             //console.log(jsonRoles[role]['#text']);
             var roles = jsonRoles[role]['#text'];
             this.roles.push({role:roles});
            
            }
           
          //console.log(this.roles)
          

      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
           //console.log('errrr');  
        }
      );               
                      
}
// get roles for assign model
getAssignRoles() {

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
          }else{
            if (typeof(obj[nodeName].push) == "undefined"){
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
           'SOAPAction':'urn:getRoleNames',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:getRoleNames/>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body);
    this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            this.AssignRoles = [];
          
            //console.log(data);
            
            // Changes XML to JSON
 
            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            //console.log(jsonFromXml);
            var jsonRoles=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:getRoleNamesResponse']['ns:return'];
            //console.log(jsonRoles);
            for (let role in jsonRoles){
             //console.log(jsonRoles[role]['#text']);
             var roles = jsonRoles[role]['#text'];
             var id=roles.replace(/[^a-zA-Z]+/g, '');
             this.AssignRoles.push({role:roles, id:id});  
            }
           
          //console.log(this.roles)
          

      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
           //console.log('errrr');  
        }
      );               
                      
}

// register User
regUser(){

     
     //alert(this.username);
     var checkboxes = [];
     $('#add-user-form input[type="checkbox"]:checked').each(function(){
        checkboxes.push($(this).val());
     });
     console.log(checkboxes);
     console.log(checkboxes[2]);
     //console.log(this.usersed);
     for(let userd of this.usersed){
        //console.log(userd.username);
        if(this.username.toLowerCase().trim() == userd.username.toLowerCase().trim()){
          this.regMess="User With The Same Username Already Exists";
             $("#regMess").fadeIn('slow');
             setTimeout(function(){
                $("#regMess").fadeOut(1000);
             }, 5000);
           return false;
        }
     }
     return false;
     if(this.username == undefined || this.username == ""){
        this.vldUsernameMess="Username is required!";
        return false;
     }else{
       this.vldUsernameMess="";
     }
     //return false;
    let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:addUser',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                    '<ser:addUser>'+                      
                         '<ser:userName>'+this.username+'</ser:userName>'+
                         '<ser:roleList>'+this.role+'</ser:roleList>'+
                         '<ser:claims>'+
                            '<xsd:claimURI>http://wso2.org/claims/country</xsd:claimURI>'+
                            '<xsd:value>England</xsd:value>'+
                         '</ser:claims>'+
                         '<ser:claims>'+
                            '<xsd:claimURI>http://wso2.org/claims/organization</xsd:claimURI>'+
                            '<xsd:value>Intuit</xsd:value>'+
                         '</ser:claims>'+
                         '<ser:profileName>default</ser:profileName>'+
                         '<ser:requirePasswordChange>false</ser:requirePasswordChange>'+
                    '</ser:addUser>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body); 
      this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            
             console.log(data);
             this.regMess="User Successfully Registered";
             $("#regMess").fadeIn('slow');
             setTimeout(function(){
                $("#regMess").fadeOut(1000);
             }, 5000);

      },
       (err : HttpErrorResponse) => {                   
           console.log(err); 
           console.log('hhh');  
        }
      );

      

}

// delete User name
deleteModalUserName(userNameDel){  
  //alert(userNameDel);
  $('#userNameDel').val(userNameDel); 
  this.delUser=event.target;
  $('#deleteUserModal .modal-body').html('Are You Sure You Want To Delete The User!');
}

// delete User
deleteUser(){
        var userDel= $('#userNameDel').val();
        let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:deleteUser',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                    '<ser:deleteUser>'+
                       '<ser:userName>'+userDel+'</ser:userName>'+
                    '</ser:deleteUser>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body); 
      this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            
             console.log(data);
             $(this.delUser).closest('tr').remove();
             $('#deleteUserModal .modal-body').html('<h5>Successfully Deleted.</h5>');
             

      },
       (err : HttpErrorResponse) => {                   
           console.log(err); 
           console.log('err del');  
        }
      );
  
  
}

// Change Password
changePassword(username){
alert('changePassword');
return false;
        var userDel= $('#userNameDel').val();
        let httpHeaders = new HttpHeaders({
           'Content-Type': 'application/soap+xml;charset=UTF-8;',
           'Authorization':'Basic YWRtaW46YWRtaW4=',
           'SOAPAction':'urn:deleteUser',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                    '<ser:deleteUser>'+
                       '<ser:userName>'+userDel+'</ser:userName>'+
                    '</ser:deleteUser>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body); 
      this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            
             console.log(data);
             $(this.delUser).closest('tr').remove();
             $('#deleteUserModal .modal-body').html('<h5>Successfully Deleted.</h5>');
             

      },
       (err : HttpErrorResponse) => {                   
           console.log(err); 
           console.log('err del');  
        }
      );
  
  
}

// Assign Roles
assignRoles(username){
//alert('assignRoles');
this.assignUsername = username;
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
          }else{
            if (typeof(obj[nodeName].push) == "undefined"){
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
           'SOAPAction':'urn:getRoleListOfUser',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:getRoleListOfUser>'+
                     '<ser:userName>'+username+'</ser:userName>'+
                  '</ser:getRoleListOfUser>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body);
    this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            this.userRoless = [];
          
            //console.log(data);
            
            // Changes XML to JSON
 
            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            //console.log(jsonFromXml);
            var jsonUserRoles=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:getRoleListOfUserResponse']['ns:return'];
            //console.log(jsonUserRoles);
            $('#assign-roles-form [type="checkbox"]').attr('checked', false); 
            for (let userRoles in jsonUserRoles){
             //console.log(jsonUserRoles[userRoles]['#text']);
             var userRolesss = jsonUserRoles[userRoles]['#text'];
             var id=userRolesss.replace(/[^a-zA-Z]+/g, '');
             
              $('#'+id).attr('checked', true);   
            }
           
           //console.log(this.userRoless)
          

      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
           //console.log('errrr');  
        }
      );  
  
  
}

// view roles
viewRoles(username){
//alert(username);
this.RoleUsername=username;
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
          }else{
            if (typeof(obj[nodeName].push) == "undefined"){
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
           'SOAPAction':'urn:getRoleListOfUser',
           'Accept': 'text/xml'
            });

            let options = {
             headers: httpHeaders,
             'responseType': 'xml',
             };  

          let body='<?xml version="1.0" encoding="UTF-8"?>'+
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://service.ws.um.carbon.wso2.org">'+
               '<soap:Header/>'+
               '<soap:Body>'+
                  '<ser:getRoleListOfUser>'+
                     '<ser:userName>'+username+'</ser:userName>'+
                  '</ser:getRoleListOfUser>'+
               '</soap:Body>'+
            '</soap:Envelope>';
      //console.log(body);
    this.http.post(`https://securene.co:9443/services/RemoteUserStoreManagerService?wsdl`,body, options)
     .subscribe((data:  Array<object>) => {
            this.userRoless = [];
          
            //console.log(data);
            
            // Changes XML to JSON
 
            var xml = data,
            var responseNu = new DOMParser().parseFromString(xml, 'application/xml');
            var jsonFromXml = xmlToJson(responseNu);
            //console.log(jsonFromXml);
            var jsonUserRoles=jsonFromXml['soapenv:Envelope']['soapenv:Body']['ns:getRoleListOfUserResponse']['ns:return'];
            //console.log(jsonUserRoles);
            for (let userRoles in jsonUserRoles){
             //console.log(jsonUserRoles[userRoles]['#text']);
             var userRolesss = jsonUserRoles[userRoles]['#text'];
             this.userRoless.push({role:userRolesss});
            
            }
           
           //console.log(this.userRoless)
          

      },
       (err : HttpErrorResponse) => {                   
           //console.log(err); 
           //console.log('errrr');  
        }
      );  
  
  
}


}