import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
@Component ({
    templateUrl: 'basic-table.html'
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
    public AlertsCount:Array<object> = [];
    public BalertsCount:Array<object> = [];
    public Balertss:Array<object> = [];
         
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
     
    this.http.get(`https://securene.co:9445/analytics/tables/TAGS_ALERT_EVENTS5/recordcount`, options)
     .subscribe((data:  Array<object>) => {
            this.alerted = [];
            this.AlertsCount = data;    
            var currentDate = new Date();
            var currentUnix = currentDate.getTime();
            var minusHund=this.AlertsCount-100;
      
    this.http.get(`https://securene.co:9445/analytics/tables/TAGS_ALERT_EVENTS5/0/`+currentUnix+`/`+minusHund+`/100`,options)
     .subscribe((data:  Array<object>) => {

               this.alertss=data;
                //console.log(this.alertss);
                for (let alertss of this.alertss){
                 //var result = alertss.values.event.substr(alertss.values.event.indexOf(":") + 2);
                 this.alerted.unshift({ asset_inventory_no: alertss.values.asset_inventory_no, site_name: alertss.values.site_name, event: alertss.values.event, timestamp: alertss.timestamp });
                }
            
              setTimeout(function(){
                $("#alertsTables tbody").show();
                $('#alertsss-spinner').hide();
                $('#alertsTables').DataTable();
              },2000);
              
});
});
   
    this.http.get(`https://securene.co:9445/analytics/tables/BATTERY_ALERT/recordcount`, options)
     .subscribe((data:  Array<object>) => {
            this.Balerts = [];
            this.BalertsCount = data;    
            var currentDate = new Date();
            var currentUnix = currentDate.getTime();
            var minusHund=this.BalertsCount-100;
           //console.log(this.BalertsCount);

    this.http.get(`https://securene.co:9445/analytics/tables/BATTERY_ALERT/0/`+currentUnix+`/`+minusHund+`/100`,options)
     .subscribe((data:  Array<object>) => {

               this.Balertss=data;
               //console.log(this.Balertss);
                for (let Balertss of this.Balertss) {
                 this.Balerts.unshift({tag_name:Balertss.values.tag_name, event: Balertss.values.event, asset_inventory_no: Balertss.values.asset_inventory_no, site_name: Balertss.values.site_name, timestamp: Balertss.timestamp });
                }
               //console.log(this.Balerts);
              setTimeout(function(){
                 $("#batteryTable tbody").show();
                 $('#battery-spinner').hide();
                 $('#batteryTable').DataTable({
                  "order":[]
                 });
              },2000);
              
              

});
});
}
}