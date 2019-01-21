import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
@Component ({
    templateUrl: 'battery.html'
})

export class BasicTableComponent implements OnInit {
    constructor(private svc: ApiService, private http: HttpClient, private router: Router){
   //this.svc.printToConsole('Got the Service'); 
  }
    dtOptions: DataTables.Settings = {};
    public AlertsAssets:Array<object> = []; 
    public alerts:Array<object> = [];
    public alertss:Array<object> = [];
    public alerted:Array<object> = [];
    public LastAlertTime = "";
    public batteryy:Array<object> = [];
    
     
    ngOnInit(): void {
        
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getAlerts();
      
         
    }    
    
    
getAlerts(){
       
       
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });
        let options = {
         headers: httpHeaders
         }; 
     

    this.http.get(`https://securene.co:9445/analytics/tables/BATTERY_TABLE4`,options)
     .subscribe((data:  Array<object>) => {
            this.battery = [];
            this.batteryy = data;
            //console.log(this.batteryy);

            for (let batteryy of this.batteryy) {
                 this.battery.unshift({tag_name:batteryy.values.tag_name, battery_level: batteryy.values.battery_level, asset_inventory_no: batteryy.values.asset_inventory_no, site_name: batteryy.values.site_name, timestamp: batteryy.timestamp });
            }
           //console.log(this.battery);
            setTimeout(function(){
               $("#batteryTables tbody").show();
               $('#batterys-spinner').hide();
               $('#batteryTables').DataTable({
                  "order":[]
                 });
            },2000);
          
          });
      

});

}
}