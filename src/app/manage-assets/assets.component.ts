import { Component, OnInit } from '@angular/core';

import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import {Router} from "@angular/router";
@Component({
    templateUrl: 'assets.html'
})
export class AssetsComponent implements OnInit {
  
  constructor(private svc: ApiService, private http: HttpClient, private router: Router){
    //this.svc.printToConsole('Got the Service');
  }
  
    public sites:Array<object> = [];
    public tags:Array<object> = [];
    public tagss:Array<object> = [];
    public reg:Array<object> = [];
    public regMess:"";
    public vldInventoryNoMess="";
    public vldTaMess="";
    public vldSitMess="";

    private  RemoveSites:  Array<object> = [];
    public RemoveAssetss:Array<object> = [];
    public RemoveAssets:Array<object> = [];
    public rem:Array<object> = [];
    public remMess:Array<object> = [];

    private IntransitSites:  Array<object> = [];
    private IntransitAssets:  Array<object> = [];
    private IntransitAssetss:  Array<object> = [];
    public inMess="";
    
    private  OutSites:  Array<object> = [];
    public OutAssetss:Array<object> = [];
    public OutAssets:Array<object> = [];
    public out:Array<object> = [];
    public outMess:Array<object> = [];

    ngOnInit() {
        
        $('#tagDisable').attr('disabled', true);
        $('#siteDisable').attr('disabled', true);
        $('#btnDisable').attr('disabled', true);
        this.getSites();
        this.getTags();
        this.getRemoveSites();
        this.getIntransitSites();
        this.getOutSites();
    }
    public  getSites(){
        
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.sites = data;
            //console.log(data);
            $('#siteDisable').attr('disabled', false);
                  
            
        });
   
    }

  
  getTags() {

            let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
            });

            let options = {
             headers: httpHeaders
             }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/tag_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.tags = data;
            //console.log(this.tags);
            //console.log(this.tags[0].values.tag_id);
            this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
               .subscribe((data:  Array<object>) => {
                 this.assets = data;
                 //console.log(this.assets);
                 //console.log(this.assets[0].values.assigned_tag_id);
                 
                 for(let tags of this.tags){
                   var temp = false;
                   //console.log(tags.values.tag_id);
                   for(let assets of this.assets){
                      //console.log(assets.values.assigned_tag_id+','+assets.values.exit_date_time);
                      if(tags.values.tag_id == assets.values.assigned_tag_id && assets.values.exit_date_time == "null" && assets.values.asset_inventory_no != undefined){
                          //console.log(tags.values.tag_id);
                          temp = true;
                          break;
                      }                   
                   }
                   if(temp != true){
                     //console.log(tagss); 
                     this.tagss.push({tag_id:tags.values.tag_id, tag_name:tags.values.tag_name});
                   }
                 }

                  
                  $('#tagDisable').attr('disabled', false);
                  $('#btnDisable').attr('disabled', false);
                  
                 
               });
            
            
        });

  } 
 
regLuggage(){
  if(this.InventoryNo == undefined || this.InventoryNo == ""){
        this.vldInventoryNoMess="Asset Inventory No. is required!";
        return false;
     }else{
       this.vldInventoryNoMess="";
     }
     if(this.ta == undefined || this.ta == ""){
        
        this.vldTaMess="Assign Tag is required!";
        return false;
     }else{
       this.vldTaMess="";
     }
     if(this.sit == undefined || this.sit == ""){
        this.vldSitMess="Assign Site is required!";
        return false;
     }else{
       this.vldSitMess="";
     }
     
  $('#btnDisable').attr('disabled', true);
    let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
            });

    let options = {
     headers: httpHeaders
     }; 

     var entryDate = new Date();
     var date = entryDate.getDate();
     var month = entryDate.getMonth(); //Be careful! January is 0 not 1
     var year = entryDate.getFullYear();
     var hours = entryDate.getHours();
     var minutes = entryDate.getMinutes();
     var seconds = entryDate.getSeconds();
     var formattedTime = hours + ':' + minutes + ':' + seconds;
     var dateString = date + "-" +(month + 1) + "-" + year+" "+formattedTime;

  let bodyy = {"event" :  {"payloadData": {"asset_inventory_no":this.InventoryNo, "assigned_site_id":this.sit,"assigned_tag_id":this.ta,"in_transit_status":false, "checkout_status":false, "asset_type": this.AssetType, "asset_brand": this.AssetBrand, "asset_owner_name": this.AssetOwnerName,"asset_owner_type": this.AssetOwnerType, "entry_date_time": dateString, "exit_date_time": "null"}}};

    this.http.post(`https://securene.co:9445/endpoints/assets`,bodyy, options)
     .subscribe((data:  Array<object>) => {
            //this.reg = data;
            //console.log(data);
            if(data == null){
             this.regMess="Asset Successfully Registered";
             $("#regMess").fadeIn('slow');
             setTimeout(function(){
                $("#regMess").fadeOut(1000);
             }, 5000);
             $('#btnDisable').attr('disabled', false);
            }
            
         
        });

      
     
}

// Remove asset

    public  getRemoveSites(){
     //console.log(btoa("admin:admin"));
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.RemoveSites = data;
            //console.log(data);
            
        });
   
    }
      
getRemoveAssets(site){

            $('#RemoveAssets').attr('disabled', true);
            let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 
 

            // Get Assets
           
            
            this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
             .subscribe((data:  Array<object>) => {
                    //console.log(data);
                      this.RemoveAssetss = [];
                      //console.log(data);
                      for(var data of data){

                        if(data.values.assigned_site_id == site && data.values.exit_date_time == "null" && data.values.asset_inventory_no != undefined){
                         //console.log(data);
                         this.RemoveAssetss.push({asset_inventory_no:data.values.asset_inventory_no});
                        }
                      }
                      //console.log(this.RemoveAssetss);
                     
                   $('#RemoveAssets').attr('disabled', false);  
                });
    }
public removeAsset(invNo){ 

  $('#btnRemove').attr('disabled', true);
        //console.log(invNo);
        //console.log(invNo);

        let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

           
           // Get Assets
            let assetArray=[];
            this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
             .subscribe((data:  Array<object>) => {
                    this.RemoveAssets = data;
                    //console.log(data);
                    for(var data of data){
                       if(data.values.asset_inventory_no == invNo){
                          assetArray['asset_inventory_no']=data.values.asset_inventory_no;
                          assetArray['assigned_site_id']=data.values.assigned_site_id;
                          assetArray['assigned_tag_id']=data.values.assigned_tag_id;
                          assetArray['in_transit_status']=data.values.in_transit_status;
                          assetArray['checkout_status']=data.values.checkout_status;
                          assetArray['asset_type']=data.values.asset_type;
                          assetArray['asset_brand']=data.values.asset_brand;
                          assetArray['asset_owner_name']=data.values.asset_owner_name;
                          assetArray['asset_owner_type']=data.values.asset_owner_type;
                          assetArray['entry_date_time']=data.values.entry_date_time;

                          var exitDate = new Date();
                           var date = exitDate.getDate();
                           var month = exitDate.getMonth(); //Be careful! January is 0 not 1
                           var year = exitDate.getFullYear();
                           var hours = exitDate.getHours();
                           var minutes = exitDate.getMinutes();
                           var seconds = exitDate.getSeconds();
                           var formattedTime = hours + ':' + minutes + ':' + seconds;
                           var dateString = date + "-" +(month + 1) + "-" + year+" "+formattedTime;
                     
                          assetArray['exit_date_time']=dateString;

                       }
                       
                    }  
                    
                    //console.log(assetArray['asset_owner_type']);

                    
                    let bodyy = {"event" :  {"payloadData": {"asset_inventory_no":assetArray['asset_inventory_no'], "assigned_site_id":assetArray['assigned_site_id'],"assigned_tag_id":assetArray['assigned_tag_id'],"in_transit_status":assetArray['in_transit_status'], "checkout_status":assetArray['checkout_status'], "asset_type": assetArray['asset_type'], "asset_brand": assetArray['asset_brand'], "asset_owner_name": assetArray['asset_owner_name'],"asset_owner_type": assetArray['asset_owner_type'], "entry_date_time": assetArray['entry_date_time'], "exit_date_time": assetArray['exit_date_time']}}};

            this.http.post(`https://securene.co:9445/endpoints/assets`,bodyy, options)
             .subscribe((data:  Array<object>) => {
                    this.rem = data;
                    //console.log(data);
                    if(data == null){
                     this.remMess="Asset Successfully  Removed";
                     $("#remMess").fadeIn('slow');
                       setTimeout(function(){
                          $("#remMess").fadeOut(1000);
                       }, 5000);
                      $('#btnRemove').attr('disabled', false); 
                      $('#RemoveAssets').val('');
                      $('#RemoveAssets').trigger('change');
                      $('#RemoveAssets #'+invNo).remove();
                    }
                    
                 
                });
                    
                    
                });
              

   }


//In Transit site

public  getIntransitSites(){
       //console.log(btoa("admin:admin"));
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.intransitSites = data;
            //console.log(data);
            
        });
   
    }
        

 public intransitAssets(){ 
 
 $('#btnIntransit').attr('disabled', true);  
        
        let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

           
           // Get Assets
            let assetArray=[];
            this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
             .subscribe((data:  Array<object>) => {
                    this.IntransitAssets = data;
                    console.log(data);
                    for(var data of data){
                       if(data.values.exit_date_time == "null"){
                          assetArray['asset_inventory_no']=data.values.asset_inventory_no;
                          assetArray['assigned_site_id']=data.values.assigned_site_id;
                          assetArray['assigned_tag_id']=data.values.assigned_tag_id;
                          assetArray['checkout_status']=data.values.checkout_status;
                          assetArray['asset_type']=data.values.asset_type;
                          assetArray['asset_brand']=data.values.asset_brand;
                          assetArray['asset_owner_name']=data.values.asset_owner_name;
                          assetArray['asset_owner_type']=data.values.asset_owner_type;
                          assetArray['entry_date_time']=data.values.entry_date_time;

                          var exitDate = new Date();
                          var date = exitDate.getDate();
                          var month = exitDate.getMonth(); //Be careful! January is 0 not 1
                          var year = exitDate.getFullYear();
                          var hours = exitDate.getHours();
                          var minutes = exitDate.getMinutes();
                          var seconds = exitDate.getSeconds();
                          var formattedTime = hours + ':' + minutes + ':' + seconds;
                          var dateString = date + "-" +(month + 1) + "-" + year+" "+formattedTime;
                     
                          assetArray['exit_date_time']=dateString;

                          let bodyy = {"event" :  {"payloadData": {"asset_inventory_no":assetArray['asset_inventory_no'], "assigned_site_id":assetArray['assigned_site_id'],"assigned_tag_id":assetArray['assigned_tag_id'], "checkout_status":assetArray['checkout_status'], "in_transit_status":true, "asset_type": assetArray['asset_type'], "asset_brand": assetArray['asset_brand'], "asset_owner_name": assetArray['asset_owner_name'],"asset_owner_type": assetArray['asset_owner_type'], "entry_date_time": assetArray['entry_date_time'], "exit_date_time": "null"}}};

                          this.http.post(`https://securene.co:9445/endpoints/assets`,bodyy, options)
                     .subscribe((data:  Array<object>) => {
                            //this.rem = data;
                            //console.log(data);
                            if(data == null){
                          
                              this.inMess="Assets Successfully  In-Transited";
                              $("#inMess").fadeIn('slow');
                                 setTimeout(function(){
                                    $("#inMess").fadeOut(1000);
                                 }, 5000);  

                              $('#btnIntransit').attr('disabled', false);
                            }
                            
                         
                        }, (err : HttpErrorResponse) => {                   
                               console.log(err); 
                            }

                        );

                       }
                    }  
                    
                    

                    
                    
                    
                });
              

     }

//Out site

public  getOutSites(){
       //console.log(btoa("admin:admin"));
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.OutSites = data;
            //console.log(this.sites);
            
        });
   
    }
        
getOutAssets(site){
//alert(site);
            $('#OutAssets').attr('disabled', true);

            let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 
 

            // Get Assets
            
           
            this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
             .subscribe((data:  Array<object>) => {
                    //console.log(data);
                      this.OutAssetss = [];
                      for(var data of data){

                        if(data.values.assigned_site_id == site && data.values.exit_date_time == "null" && data.values.asset_inventory_no != undefined){
                         //console.log(data);
                         this.OutAssetss.push({asset_inventory_no:data.values.asset_inventory_no});
                        }
                      }
                     
                   $('#OutAssets').attr('disabled', false);  
                });
    }



 public outAsset(){ 
 
 $('#btnOut').attr('disabled', true);  

        var invNo = this.invNo;
        //return false;
        
        let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

           
           // Get Assets
            let assetArray=[];
            this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
             .subscribe((data:  Array<object>) => {
                    this.OutAssets = data;
                    //console.log(data);
                    for(var data of data){
                       if(data.values.asset_inventory_no == invNo){
                          assetArray['asset_inventory_no']=data.values.asset_inventory_no;
                          assetArray['assigned_site_id']=data.values.assigned_site_id;
                          assetArray['assigned_tag_id']=data.values.assigned_tag_id;
                          assetArray['in_transit_status']=data.values.in_transit_status;
                          assetArray['asset_type']=data.values.asset_type;
                          assetArray['asset_brand']=data.values.asset_brand;
                          assetArray['asset_owner_name']=data.values.asset_owner_name;
                          assetArray['asset_owner_type']=data.values.asset_owner_type;
                          assetArray['entry_date_time']=data.values.entry_date_time;

                          var exitDate = new Date();
                           var date = exitDate.getDate();
                           var month = exitDate.getMonth(); //Be careful! January is 0 not 1
                           var year = exitDate.getFullYear();
                           var hours = exitDate.getHours();
                           var minutes = exitDate.getMinutes();
                           var seconds = exitDate.getSeconds();
                           var formattedTime = hours + ':' + minutes + ':' + seconds;
                           var dateString = date + "-" +(month + 1) + "-" + year+" "+formattedTime;
                     
                          assetArray['exit_date_time']=dateString;

                       }
                       
                    }  
                    
                    //console.log(assetArray['asset_owner_type']);

                    //alert(transferSite);
                    //return false;
                    let bodyy = {"event" :  {"payloadData": {"asset_inventory_no":assetArray['asset_inventory_no'], "assigned_site_id":assetArray['assigned_site_id'],"assigned_tag_id":assetArray['assigned_tag_id'], "in_transit_status":assetArray['in_transit_status'], "checkout_status":true, "asset_type": assetArray['asset_type'], "asset_brand": assetArray['asset_brand'], "asset_owner_name": assetArray['asset_owner_name'],"asset_owner_type": assetArray['asset_owner_type'], "entry_date_time": assetArray['entry_date_time'], "exit_date_time": "null"}}};

                    this.http.post(`https://securene.co:9445/endpoints/assets`,bodyy, options)
                     .subscribe((data:  Array<object>) => {
                            //this.rem = data;
                            console.log(data);
                            if(data == null){
                            

                              this.outMess="Asset Successfully  Checked Out";
                              $("#outMess").fadeIn('slow');
                                 setTimeout(function(){
                                    $("#outMess").fadeOut(1000);
                                 }, 5000);
                              $('#OutAssets').val('');
                              $('#OutAssets').trigger('change');
                              $('#OutAssets #'+invNo).remove();

                              $('#btnOut').attr('disabled', false);
                            }
                            
                         
                        }, (err : HttpErrorResponse) => {                   
                               console.log(err); 
                            }

                        );
                    
                    
                });
              

     }


}