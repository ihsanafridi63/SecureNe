import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
@Component ({
    templateUrl: 'sign-in2.html'
})

export class SignIn2Component implements OnInit {
  cookieValue = 'UNKNOWN';
   constructor(private svc: ApiService, private http: HttpClient, private router: Router,  private cookieService: CookieService ){
    
  }

   public sign: Array<object> = [];
   public message= "";
   ngOnInit():void {
   
    if(localStorage.getItem('userToken')){
      this.router.navigate(['/dashboardMap']);
    }else{
      
      $('#auth').show();
    }
           
    }

  login(){
    
    var element = document.getElementById("spinner");
    element.classList.add("fa-spinner");
    var username = this.username;
    var password = this.password;
    var userpass64 = btoa(username + ":" + password);

    var client_secret = "hfkfq7qN_UEemSOTI56XWW3j_ZIa";
    var client_id = "epyd71IQau1sdYf9zLDt6SL5_uYa";
    var client64 = btoa(client_id+":"+client_secret);

    let httpHeaders = new HttpHeaders({
       'Content-Type' : 'application/x-www-form-urlencoded',
       'Authorization':'Basic '+ client64
    });
    let options = {
     headers: httpHeaders
     }; 
    let body="grant_type=password&username="+username+"&password="+password+"&scope=perm:sign-csr perm:admin:devices:view perm:admin:topics:view perm:roles:add perm:roles:add-users perm:roles:update perm:roles:permissions perm:roles:details perm:roles:view perm:roles:create-combined-role perm:roles:delete perm:dashboard:vulnerabilities perm:dashboard:non-compliant-count perm:dashboard:non-compliant perm:dashboard:by-groups perm:dashboard:device-counts perm:dashboard:feature-non-compliant perm:dashboard:count-overview perm:dashboard:filtered-count perm:dashboard:details perm:get-activity perm:devices:delete perm:devices:applications perm:devices:effective-policy perm:devices:compliance-data perm:devices:features perm:devices:operations perm:devices:search perm:devices:details perm:devices:update perm:devices:view perm:view-configuration perm:manage-configuration perm:policies:remove perm:policies:priorities perm:policies:deactivate perm:policies:get-policy-details perm:policies:manage perm:policies:activate perm:policies:update perm:policies:changes perm:policies:get-details perm:users:add perm:users:details perm:users:count perm:users:delete perm:users:roles perm:users:user-details perm:users:credentials perm:users:search perm:users:is-exist perm:users:update perm:users:send-invitation perm:admin-users:view perm:groups:devices perm:groups:update perm:groups:add perm:groups:device perm:groups:devices-count perm:groups:remove perm:groups:groups perm:groups:groups-view perm:groups:share perm:groups:count perm:groups:roles perm:groups:devices-remove perm:groups:devices-add perm:groups:assign perm:device-types:features perm:device-types:types perm:applications:install perm:applications:uninstall perm:admin-groups:count perm:admin-groups:view perm:notifications:mark-checked perm:notifications:view perm:admin:certificates:delete perm:admin:certificates:details perm:admin:certificates:view perm:admin:certificates:add perm:admin:certificates:verify perm:admin perm:devicetype:deployment perm:device-types:events perm:device-types:events:view perm:admin:device-type perm:device:enroll perm:geo-service:analytics-view perm:geo-service:alerts-manage perm:sign-csr perm:admin:devices:view perm:roles:add perm:roles:add-users perm:roles:update perm:roles:permissions perm:roles:details perm:roles:view perm:roles:create-combined-role perm:roles:delete perm:get-activity perm:devices:delete perm:devices:applications perm:devices:effective-policy perm:devices:compliance-data perm:devices:features perm:devices:operations perm:devices:search perm:devices:details perm:devices:update perm:devices:view perm:view-configuration perm:manage-configuration perm:policies:remove perm:policies:priorities perm:policies:deactivate perm:policies:get-policy-details perm:policies:manage perm:policies:activate perm:policies:update perm:policies:changes perm:policies:get-details perm:users:add perm:users:details perm:users:count perm:users:delete perm:users:roles perm:users:user-details perm:users:credentials perm:users:search perm:users:is-exist perm:users:update perm:users:send-invitation perm:admin-users:view perm:groups:devices perm:groups:update perm:groups:add perm:groups:device perm:groups:devices-count perm:groups:remove perm:groups:groups perm:groups:groups-view perm:groups:share perm:groups:count perm:groups:roles perm:groups:devices-remove perm:groups:devices-add perm:groups:assign perm:device-types:features perm:device-types:types perm:applications:install perm:applications:uninstall perm:admin-groups:count perm:admin-groups:view perm:notifications:mark-checked perm:notifications:view perm:admin:certificates:delete perm:admin:certificates:details perm:admin:certificates:view perm:admin:certificates:add perm:admin:certificates:verify perm:ios:enroll perm:ios:view-device perm:ios:apn perm:ios:ldap perm:ios:enterprise-app perm:ios:store-application perm:ios:remove-application perm:ios:app-list perm:ios:profile-list perm:ios:lock perm:ios:enterprise-wipe perm:ios:device-info perm:ios:restriction perm:ios:email perm:ios:cellular perm:ios:applications perm:ios:wifi perm:ios:ring perm:ios:location perm:ios:notification perm:ios:airplay perm:ios:caldav perm:ios:cal-subscription perm:ios:passcode-policy perm:ios:webclip perm:ios:vpn perm:ios:per-app-vpn perm:ios:app-to-per-app-vpn perm:ios:app-lock perm:ios:clear-passcode perm:ios:remove-profile perm:ios:get-restrictions perm:ios:wipe-data perm:admin perm:android:enroll perm:android:wipe perm:android:ring perm:android:lock-devices perm:android:configure-vpn perm:android:configure-wifi perm:android:enroll perm:android:uninstall-application perm:android:manage-configuration perm:android:location perm:android:install-application perm:android:mute perm:android:change-lock-code perm:android:blacklist-applications perm:android:set-password-policy perm:android:encrypt-storage perm:android:clear-password perm:android:enterprise-wipe perm:android:info perm:android:view-configuration perm:android:upgrade-firmware perm:android:set-webclip perm:android:send-notification perm:android:disenroll perm:android:update-application perm:android:unlock-devices perm:android:control-camera perm:android:reboot perm:android:logcat perm:device:enroll perm:device:disenroll perm:device:modify perm:device:operations perm:device:publish-event";
    /*
    let body = "grant_type=password&username="+username+"&password="+password+"&scope=perm:sign-csr perm:admin:devices:view perm:roles:add perm:roles:add-users perm:roles:update perm:roles:permissions perm:roles:details perm:roles:view perm:roles:create-combined-role perm:roles:delete perm:get-activity perm:devices:delete perm:devices:applications perm:devices:effective-policy perm:devices:compliance-data perm:devices:features perm:devices:operations perm:devices:search perm:devices:details perm:devices:update perm:devices:view perm:view-configuration perm:manage-configuration perm:policies:remove perm:policies:priorities perm:policies:deactivate perm:policies:get-policy-details perm:policies:manage perm:policies:activate perm:policies:update perm:policies:changes perm:policies:get-details perm:users:add perm:users:details perm:users:count perm:users:delete perm:users:roles perm:users:user-details perm:users:credentials perm:users:search perm:users:is-exist perm:users:update perm:users:send-invitation perm:admin-users:view perm:groups:devices perm:groups:update perm:groups:add perm:groups:device perm:groups:devices-count perm:groups:remove perm:groups:groups perm:groups:groups-view perm:groups:share perm:groups:count perm:groups:roles perm:groups:devices-remove perm:groups:devices-add perm:groups:assign perm:device-types:features perm:device-types:types perm:applications:install perm:applications:uninstall perm:admin-groups:count perm:admin-groups:view perm:notifications:mark-checked perm:notifications:view perm:admin:certificates:delete perm:admin:certificates:details perm:admin:certificates:view perm:admin:certificates:add perm:admin:certificates:verify perm:ios:enroll perm:ios:view-device perm:ios:apn perm:ios:ldap perm:ios:enterprise-app perm:ios:store-application perm:ios:remove-application perm:ios:app-list perm:ios:profile-list perm:ios:lock perm:ios:enterprise-wipe perm:ios:device-info perm:ios:restriction perm:ios:email perm:ios:cellular perm:ios:applications perm:ios:wifi perm:ios:ring perm:ios:location perm:ios:notification perm:ios:airplay perm:ios:caldav perm:ios:cal-subscription perm:ios:passcode-policy perm:ios:webclip perm:ios:vpn perm:ios:per-app-vpn perm:ios:app-to-per-app-vpn perm:ios:app-lock perm:ios:clear-passcode perm:ios:remove-profile perm:ios:get-restrictions perm:ios:wipe-data perm:admin perm:android:enroll perm:android:wipe perm:android:ring perm:android:lock-devices perm:android:configure-vpn perm:android:configure-wifi perm:android:enroll perm:android:uninstall-application perm:android:manage-configuration perm:android:location perm:android:install-application perm:android:mute perm:android:change-lock-code perm:android:blacklist-applications perm:android:set-password-policy perm:android:encrypt-storage perm:android:clear-password perm:android:enterprise-wipe perm:android:info perm:android:view-configuration perm:android:upgrade-firmware perm:android:set-webclip perm:android:send-notification perm:android:disenroll perm:android:update-application perm:android:unlock-devices perm:android:control-camera perm:android:reboot perm:android:logcat";
    */

    this.http.post('https://securene.co:8243/token',body, options)
     .subscribe((data:  Array<object>) => {
          
          this.sign = data;
          console.log(this.sign);
          var access_token = data.access_token;
          var refresh_token = data.refresh_token;
          localStorage.setItem('userToken',access_token);
          //localStorage.setItem('logUser','user');
          //var flag = true;
          ////console.log(flag,'in');   
           //console.log(UserName);
           //console.log(Password);
          this.router.navigate(['/dashboardMap']);         
        },
        (err : HttpErrorResponse) => {
          
           this.message = "Invalid Username Or Password!";
           var element = document.getElementById("spinner");
           var aa = element.classList.remove("fa-spinner");
        }
      );
      



       // http://localhost/ips-apis-ci/index.php/users/login
       // https://192.168.8.103:9445/token
       // https://192.168.8.103:8243/api-application-registration/register
      
}
}
