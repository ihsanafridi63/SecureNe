import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
@Component ({
    templateUrl: 'asset-history.html'
})

export class AssetHistoryComponent implements OnInit {
    constructor(private svc: ApiService, private http: HttpClient, private router: Router){
   //this.svc.printToConsole('Got the Service'); 
  }
    dtOptions: DataTables.Settings = {};
    public history:Array<object> = [];
    public historyed:Array<object> = [];
     
    ngOnInit(): void {
        
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getHistory();
      
         
    }    
    
    
getHistory(){
       
       
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });
        let options = {
         headers: httpHeaders
         }; 
     
    this.http.get(`https://securene.co:9445/analytics/tables/asset_history`, options)
     .subscribe((data:  Array<object>) => {
            this.historyed = [];
            this.history = data; 
            //console.log(data);
            
                for (let history of this.history) {
                 this.historyed.unshift({site_name: history.values.site_name, asset_inventory_no: history.values.asset_inventory_no, tag_name: history.values.tag_name, entry_date_time:history.values.entry_date_time, exit_date_time:history.values.exit_date_time});
                }
               
              //console.log(this.historyed)
              setTimeout(function(){
                $("#historyTable tbody").show();
                $('#historyy-spinner').hide();
                $('#historyTable').DataTable();
              },2000);


});
}
}