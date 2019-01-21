// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />
import { Component, AfterViewChecked, OnInit } from '@angular/core';
import { ThemeConstants } from '../shared/config/theme-constant';
import 'ammap3';
import 'ammap3/ammap/maps/js/usaLow';
import Chart from 'chart.js';
import 'src/assets/js/jquery.sparkline/jquery.sparkline.js';
import * as $ from 'jquery';
import { GlobalsService } from '../globals/globals.service';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NgForm } from '@angular/forms';
import {Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'dashboard.html'
})

export class DashboardComponent implements OnInit{
public isCompleted: any;
    public onStep2Next: any;
    public onStep3Next: any;
    public onComplete: any;
    public lat: number;
    public lng: number;
    Public CountAssetsInSites = "";
    Public singleComma = "";
    public checkCount = 0;
    public transferCount = 0;
    public transitCount = 0;
    public offCount = 0;
    public claimCount = 0;
    public outCount = 0;
    public checkMissingCount = 0;
    public transferMissingCount = 0;
    public transitMissingCount = 0;
    public offMissingCount = 0;
    public claimMissingCount = 0;
    public assetStateCount = 0;
    public assetStateMissingCount = 0;
    public sitedd="";
    public sited="";
    public markersTransit = [];
    public markersCheck = [];
    public markersTransfer = [];
    public markersOff = [];
    public markersClaim = [];
    public markersOut = [];
    public map = "";
    public recBoundsTransit = "";
    public recBoundsCheck = "";
    public recBoundsTransfer = "";
    public recBoundsOff = "";
    public recBoundsClaim = "";
    public recBoundsOut = "";
    public icon = "";
    public assetStateTransit = [];
    public assetStateCheck = [];
    public assetStateTransfer = [];
    public assetStateOff = [];
    public assetStateClaim = [];
    public assetStateOut = [];
    public plottedArrayTransit = [];
    public plottedArrayCheck = [];
    public plottedArrayTransfer = [];
    public plottedArrayOff = [];
    public plottedArrayClaim = [];
    public plottedArrayOut = [];
    public newArrayTransit = [];
    public newArrayCheck = [];
    public newArrayTransfer = [];
    public newArrayOff = [];
    public newArrayClaim = [];
    public newArrayOut = [];
    public counters = 0;
    public imageBoundsTransit;
    public overlayOptsTransit;
    public historicalOverlayTransit;
    public alertsCounters = 0;
    public  LastAlertTime = "";
    public  netSymbol = "";
    public  asseted = "";
    public stateInv="";
    public idUrl = "";

    constructor(private svc: ApiService, private route: ActivatedRoute,  private http: HttpClient, private colorConfig:ThemeConstants, private router: Router, private globals: GlobalsService){
     //this.svc.printToConsole('Got the Service');
    }
    
    private  sites:  Array<object> = [];
    private  assetsInSite:  Array<object> = [];
    private  siteConnection:  Array<object> = [];
    private  assets:  Array<object> = [];
    private  assetsAnalytics:  Array<object> = [];
    private  assetAndAlertobj:  Array<object> = [];
    private  AlertsAssets:  Array<object> = [];
    private  siteInfo: Array<object> = [];
    private  StateAgainstAsset: Array<object> = [];
    private  assetInfo:  Array<object> = [];
    private  alerts:  Array<object> = [];
    private  alertss:  Array<object> = [];
    private  alertsss:  Array<object> = [];
    private  assetsStates: Array<object> =[];
    private  sitesmap:  Array<object> = [];
    private  invNTag:  Array<object> = [];
    private  Tag_States_old:  Array<object> = [];
    private  AlertsCount:  Array<object> = [];

    ngOnInit() {  
    this.route.paramMap.subscribe(params => {
                this.idUrl = params.get("id");

                //console.log(this.idUrl, "UU");
                //this.getAssetsAnalyticsss(this.idUrl);

              });
              
        this.getPieChart();
        this.InitMap();
        this.getSites();
       if (this.intervals) {
             clearInterval(this.intervals);
        }
    this.getAlerts();
      this.intervals=setInterval(()=>{
         this.getAlerts();

      }, 60000);

      if(this.idUrl != null) {
          this.getAssetsAnalyticsss(this.idUrl);
      }
            
    }
    ngOnDestroy(){
      clearInterval(this.intervals);
      clearInterval(this.intervalss);
      clearInterval(this.intervalsss);
    }

public  getPieChart(){
  // Load google charts
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
     
    // Draw the chart and set the chart values
    function drawChart() {
      var data = google.visualization.arrayToDataTable([
      ['Task', 'Asset State Analysis'],
      ['Select Site', 100]
    ]);

      var options = {'is3D':true, 'height':170};

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));
      chart.draw(data, options);
      $("#pie-spinner").hide();
    } 
}
public  InitMap(){
 
            var historicalOverlay;
            var opacity;
            
            //var latlng = new google.maps.LatLng(24.897270, 67.079104);
            var myOptions = {
                zoom: 5,
                center: new google.maps.LatLng(29.21218662048404, 69.1109698818359),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.map = new google.maps.Map(document.getElementById("googleMap"), myOptions);

            // Lahore Airport image bound
            var imageBounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(31.017707574960824,69.00865970117184),
              new google.maps.LatLng(33.36042848714566,75.02916751367184)    
            );
            //var cent=imageBounds.getCenter();
            //this.map.setCenter(cent);
          
        var overlayOpts = {
              opacity:1
          }
          historicalOverlay = new google.maps.GroundOverlay(
              'assets/images/lahore_airport.png',
              imageBounds, overlayOpts);
           
          historicalOverlay.setMap(this.map);

          // karachi airport image bound
          imageBounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(24.912324593622955,62.81851482058687),
              new google.maps.LatLng(28.461524320571165,70.89830813867184)    
            );
            //var cent=imageBounds.getCenter();
            //this.map.setCenter(cent);
          
        var overlayOpts = {
              opacity:1
          }
          historicalOverlay = new google.maps.GroundOverlay(
              'assets/images/karachi_airport.png',
              imageBounds, overlayOpts);
           
          historicalOverlay.setMap(this.map);

          // In-Transit image bound
          this.imageBoundsTransit = new google.maps.LatLngBounds(
              new google.maps.LatLng(28.61594707609946,67.77819095117184),
              new google.maps.LatLng(30.60253298391224,71.42565188867184)    
            );
            //var cent=imageBounds.getCenter();
            //this.map.setCenter(cent);
        this.overlayOptsTransit = {
              opacity:1
          }
          this.historicalOverlayTransit = new google.maps.GroundOverlay(
              'assets/images/in-transit.png',
              this.imageBoundsTransit, this.overlayOptsTransit);
           
          this.historicalOverlayTransit.setMap(this.map);

}

public  getSites(site){
  this.sitedd = site;
        //console.log(this.globals.role);
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    
    
    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {

                      if(site == undefined){
                         this.sites = data;
                         //console.log(data);
                      }else{
                         this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
                         .subscribe((data:  Array<object>) => {
                                this.assetsInSite = data;
                                //console.log(data);
                                this.CountAssetsInSites = 0;
                                
                                for(var numbers of this.assetsInSite){

                                  if(numbers.values.assigned_site_id == this.sitedd && numbers.values.exit_date_time == "null" && numbers.values.asset_inventory_no != undefined){
                                   
                                   this.CountAssetsInSites = this.CountAssetsInSites + 1; 
                                   
                                   //alert(this.CountAssetsInSites);
                                  }
                                }
                               
                                
                            });
                         for(var info of this.sites){
                          if(info.values.site_id == site){
                            this.singleComma = ", ";
                            this.siteInfo = info;
                          }
                        }
                         //alert(site);
                      }
            
            
        });
   
}

getAssetsAnalyticsss(site){

      if(this.sitedd != site){
         $('#siteStatus').hide();
         this.asseted = "";
      }
     this.sitedd = site;

    $('#spinner').addClass('fa-spinner');
    $('#siteValue').attr('disabled', true);
    $('#assets').attr('disabled', true);
     this.getSites(site);
     this.siteStatus(site);
     this.getAssets(site);
     this.getAnalytics(site);
     this.getStates(site);
     this.getMapLatLng(site);
    if (this.intervalsss) {
        clearInterval(this.intervalsss);
    }
    if (this.intervalss) {
        clearInterval(this.intervalss);
    }
           
     this.intervalss=setInterval(()=>{
         this.siteStatus(site);
         if(this.asseted == ""){
          this.getAssets(site);
          this.getAnalytics(site);
         }
         this.getStates(site);
         this.getMapLatLng(site);
      }, 60000); 

    }
getAssetsAnalyticsAndInfo(asset){
  
   this.asseted = asset;
   this.AnalyticsAgainstAsset();
   this.getAssetInfo(this.asseted);
    if(this.intervalsss){
       clearInterval(this.intervalsss);
    }
    this.intervalsss=setInterval(()=>{
        this.AnalyticsAgainstAsset();
      }, 60000);
}

analyticsTransfer(){
    $('#invTagReg').html('');
    $('#invTagReg').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.analyticsModalStates){
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Transfer Loading" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }
                   
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagReg').html('');
                if(temp == "true"){
                   $('#invTagReg').html(invTag);
                }else{
                    $('#invTagReg').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                   
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}
analyticsTransferMs(){
    $('#invTagRegMs').html('');
    $('#invTagRegMs').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.analyticsModalStates){
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Transfer Loading Missing" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }
                   
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagRegMs').html('');
                if(temp == "true"){
                   $('#invTagRegMs').html(invTag);
                }else{
                    $('#invTagRegMs').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}
analyticsOff(){

    $('#invTagSto').html('');
    $('#invTagSto').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){

              if(modalAssets.values.assigned_site_id == this.sitedd){

                for(let modalStates of this.Tag_States_old){
                    if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Off-loading" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }
                
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagSto').html('');
                if(temp == "true"){
                   $('#invTagSto').html(invTag);
                }else{
                    $('#invTagSto').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}
analyticsOffMs(){
    $('#invTagStoMs').html('');
    $('#invTagStoMs').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){

              if(modalAssets.values.assigned_site_id == this.sitedd){

                for(let modalStates of this.Tag_States_old){
                    if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Off-loading Missing" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }
                
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagStoMs').html('');
                if(temp == "true"){
                   $('#invTagStoMs').html(invTag);
                }else{
                    $('#invTagStoMs').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}
analyticsCheck(){
    $('#invTagUnd').html('');
    $('#invTagUnd').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){
                   
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Check-in" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }
                   
                   
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagUnd').html('');
                if(temp == "true"){
                   $('#invTagUnd').html(invTag);
                }else{
                    $('#invTagUnd').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
               
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}

analyticsCheckMs(){
    $('#invTagUndMs').html('');
    $('#invTagUndMs').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){
                   
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Check-in Missing" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }
                   
                   
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagUndMs').html('');
                if(temp == "true"){
                   $('#invTagUndMs').html(invTag);
                }else{
                    $('#invTagUndMs').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
               
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}
analyticsClaim(){
    $('#invTagInt').html('');
    $('#invTagInt').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){
                  
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Baggage Claim" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }  
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagInt').html('');
                if(temp == "true"){
                   $('#invTagInt').html(invTag);
                }else{
                    $('#invTagInt').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}

analyticsClaimMs(){
    $('#invTagIntMs').html('');
    $('#invTagIntMs').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Baggage Claim Missing" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }  
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagIntMs').html('');
                if(temp == "true"){
                   $('#invTagIntMs').html(invTag);
                }else{
                    $('#invTagIntMs').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}
analyticsOut(){
    $('#invTagOut').html('');
    $('#invTagOut').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){
                  
                   if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "Check-out" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                     this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;
                   }  
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
                } 
                $('#invTagOut').html('');
                if(temp == "true"){
                   $('#invTagOut').html(invTag);
                }else{
                    $('#invTagOut').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
          
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}

analyticsTransit(){
    $('#invTagUna').html('');
    $('#invTagUna').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){  
                     if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "In-Transit" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                       this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;                   
                     } 
                   //break;
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagUna').html('');
                if(temp == "true"){
                   $('#invTagUna').html(invTag);
                }else{
                    $('#invTagUna').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                
                
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}

analyticsTransitMs(){
    $('#invTagUnaMs').html('');
    $('#invTagUnaMs').html('<tr><td colspan="2" style="text-align:center">'
      +'<span id="invTag-spinner" class="fa fa-spin fa-spinner" style="font-size:24px;">'
      +'</span></td></tr>');
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
               this.tagIdAssetInv=[];
               this.analyticsModalAssets =[];
               this.analyticsModalAssets =data;
               //console.log(this.analyticsModalAssets);
        this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
            this.analyticsModalStates = [];
            this.analyticsModalStates = data;
            //console.log(this.analyticsModalStates);
            for(let modalAssets of this.analyticsModalAssets){
              if(modalAssets.values.assigned_site_id == this.sitedd){
                for(let modalStates of this.Tag_States_old){  
                     if(modalAssets.values.assigned_tag_id == modalStates.values.tag_id && modalStates.values.state == "In-Transit Missing" && modalAssets.values.exit_date_time == "null" && modalAssets.values.asset_inventory_no != undefined){
                       this.tagIdAssetInv[modalStates.values.tag_id] = modalAssets.values.asset_inventory_no;                   
                     } 
                   //break;
                }
              }
            }
         //console.log(this.tagIdAssetInv);
        this.http.get(`https://securene.co:9445/analytics/tables/TAG_DATA_STREAM`, options)
         .subscribe((data:  Array<object>) => {
              
                this.invNTag=[];
                this.analyticsModalTag=[];
                this.analyticsModalTag=data;
                var invTag='';
                //console.log(this.analyticsModalTag);
                //$('#analyticModal')
                for(let tag of this.analyticsModalTag){
                  for(var tagIdInv in this.tagIdAssetInv){
                   if(tag.values.tag_id == tagIdInv){
                   invTag+='<tr><td>'+this.tagIdAssetInv[tagIdInv]+'</td><td>'+tag.values.tag_name+'</td></tr>';
                      var temp ="true";
                   }
                     
                  }
            
                } 
                $('#invTagUnaMs').html('');
                if(temp == "true"){
                   $('#invTagUnaMs').html(invTag);
                }else{
                    $('#invTagUnaMs').html('<tr><td colspan="2" style="text-align:center">'
                  +'No Record Found'
                  +'</td></tr>');
                }
                //console.log(this.invNTag);
                 
            }); 
            });
            });
}

siteStatus(site){

this.sitedd = site;


           let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 
              // Get Assets
           
            
              
              this.http.get(`https://securene.co:9445/analytics/tables/get_sites_status`, options)
               .subscribe((data:  Array<object>) => {
                    
                      //console.log(data);
                      this.siteConnection=data;
                      //console.log(this.siteConnection);
                      for(let con of this.siteConnection){
                        if(con.values.site_id==this.sitedd){
                           //console.log(con.values.status);
                          if(con.values.status == true){
                            
                            this.netSymbol="true";
                          }else{
                            
                            this.netSymbol="false";
                          }
                        }
                        
                      } 
                  
                  }); 
                 
}
getAssets(site){

this.sitedd = site;


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
                      
                      //console.log(data[0].values);
                      this.assets=[];
                      for(var data of data){

                        if(data.values.assigned_site_id == this.sitedd && data.values.exit_date_time == "null" && data.values.asset_inventory_no != undefined){
                         //console.log(data);
                         this.assets.push({asset_inventory_no:data.values.asset_inventory_no});
                        }
                      }
                   
                   $('#assets').attr('disabled', false);   
                  }); 
                 
}

getAnalytics(site){
$('[href="#step6"]').attr('data-target','#outModal');
//console.log(site);
this.sitedd = site;    
           let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

          // Get Assets Analytics   
          var dated = new Date();
          dated.setSeconds(0);
          var FromTime = dated.getTime()-30000;           
          var EndTime = FromTime + 30000; 

          //console.log(FromTime+","+EndTime);
          //var Fromreal=new Date(FromTime);
          //var Fromreal = Fromreal.getMinutes()+":"+Fromreal.getSeconds();
          //var Endreal = new Date(EndTime);
          //var Endreal = Endreal.getMinutes()+":"+Endreal.getSeconds();
          //console.log(Fromreal+","+Endreal);

          this.http.get(`https://securene.co:9445/analytics/tables/ANALYTICS_PER_MINUTE/`+FromTime+`/`+EndTime, options)
             .subscribe((data:  Array<object>) => {
                    this.assetsAnalytics = data;
                    //console.log(this.assetsAnalytics);
        
            $('.status-anc').removeClass('active');
            $('.stepMCount').html('0');
            $('.stepACount').html('0');
            $('.stepCount6').html('0');
            this.checkCount = 0;
            this.transferCount = 0;
            this.transitCount = 0;
            this.offCount = 0;
            this.claimCount = 0;
            this.outCount = 0;

            this.checkMissingCount = 0;
            this.transferMissingCount = 0;
            this.transitMissingCount = 0;
            this.offMissingCount = 0;
            this.claimMissingCount = 0;

            this.assetStateCount = 0;
            this.assetStateMissingCount = 0;

           //console.log(data);

            for(var data of this.assetsAnalytics){
              if(data.values.site_id == this.sitedd){
                 //console.log(data);
                // console.log(data.values.state+','+data.values.count);
                 if(data.values.state == 'Check-in'){
                    $('[href="#step1"]').removeClass('active');
                    $('[href="#step1"]').addClass('active');
                    $('#stepACount1').html(data.values.count);
                    this.checkCount = data.values.count;
                    this.assetStateCount = this.assetStateCount+this.checkCount; 
                 }
                 if(data.values.state == 'Check-in Missing'){
                    $('[href="#step1"]').removeClass('active');
                    $('[href="#step1"]').addClass('active');
                    $('#stepMCount1').html(data.values.count);
                    this.checkMissingCount = data.values.count;
                    this.assetStateMissingCount = this.assetStateMissingCount+this.checkMissingCount;    
                 }
                 if(data.values.state == 'Transfer Loading'){
                    $('[href="#step2"]').removeClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('#stepACount2').html(data.values.count);
                    this.transferCount = data.values.count;
                    this.assetStateCount = this.assetStateCount+this.transferCount;
                 }
                 if(data.values.state == 'Transfer Loading Missing'){
                    $('[href="#step2"]').removeClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('#stepMCount2').html(data.values.count);
                    this.transferMissingCount = data.values.count;
                    this.assetStateMissingCount = this.assetStateMissingCount+this.transferMissingCount;
                 }
                 if(data.values.state == 'In-Transit'){
                    $('[href="#step3"]').removeClass('active');
                    $('[href="#step3"]').addClass('active');
                    $('#stepACount3').html(data.values.count);
                    this.transitCount = data.values.count;
                    this.assetStateCount = this.assetStateCount+this.transitCount;
                 }
                 if(data.values.state == 'In-Transit Missing'){
                    $('[href="#step3"]').removeClass('active');
                    $('[href="#step3"]').addClass('active');
                    $('#stepMCount3').html(data.values.count);
                    this.transitMissingCount = data.values.count;
                    this.assetStateMissingCount = this.assetStateMissingCount+this.transitMissingCount;
                 }
                 if(data.values.state == 'Off-loading'){
                   $('[href="#step4"]').removeClass('active');
                   $('[href="#step4"]').addClass('active');
                   $('#stepACount4').html(data.values.count);
                   this.offCount = data.values.count;
                   this.assetStateCount = this.assetStateCount+this.offCount;
                 }
                 if(data.values.state == 'Off-loading Missing'){
                   $('[href="#step4"]').removeClass('active');
                   $('[href="#step4"]').addClass('active');
                   $('#stepMCount4').html(data.values.count);
                   this.offMissingCount = data.values.count;
                   this.assetStateMissingCount = this.assetStateMissingCount+this.offMissingCount;
                 }
                 if(data.values.state == 'Baggage Claim'){
                   $('[href="#step5"]').removeClass('active');
                   $('[href="#step5"]').addClass('active');
                   $('#stepACount5').html(data.values.count);
                   this.claimCount = data.values.count;
                   this.assetStateCount = this.assetStateCount+this.claimCount;
                 }
                 if(data.values.state == 'Baggage Claim Missing'){
                   $('[href="#step5"]').removeClass('active');
                   $('[href="#step5"]').addClass('active');
                   $('#stepMCount5').html(data.values.count);
                   this.claimMissingCount = data.values.count;
                   this.assetStateMissingCount = this.assetStateMissingCount+this.claimMissingCount;
                 }
                 if(data.values.state == 'Check-out'){
                   $('[href="#step6"]').removeClass('active');
                   $('[href="#step6"]').addClass('active');
                   $('.stepCount6').html(data.values.count);
                   this.outCount = data.values.count;
                   this.assetStateCount = this.assetStateCount+this.outCount;
                 }
                 
              }
            }

      var missTotal = this.checkMissingCount+this.transferMissingCount+this.transitMissingCount+this.offMissingCount+this.claimMissingCount;
              
               var checkPercent = this.checkCount;
               var transferPercent = this.transferCount;
               var transitPercent = this.transitCount;
               var offPercent = this.offCount;
               var claimPercent = this.claimCount;
               var outPercent = this.outCount;
               var missPercent = missTotal;
              
              // Draw the chart and set the chart values
              if(this.assetStateCount != 0){
              
              // Load google charts
              google.charts.load('current', {'packages':['corechart']});
              google.charts.setOnLoadCallback(drawChart);

              function drawChart() {
               
                    var data = google.visualization.arrayToDataTable([
                    
                    ['Task', 'Asset State Analysis'],
                    ['Check-in', checkPercent],
                    ['Transfer Loading', transferPercent],
                    ['In-Transit', transitPercent],
                    ['Off-loading', offPercent],
                    ['Baggage Claim', claimPercent],
                    ['Check-out', outPercent],
                    ['Missing', missPercent]
                  ]);
                
                    var options = {'is3D':true, 'height':170, 'colors':['#2188e0','#279e3a','#6d0404','#39e11a','#0b1cdd', '#74ad6e', '#ff0000']};
                    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                    chart.draw(data, options);
              }
            }else{
               
               // Load google charts
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
                 
                // Draw the chart and set the chart values
                function drawChart() {
                  var data = google.visualization.arrayToDataTable([
                  ['Task', 'Asset State Analysis'],
                  [site+' Has No Asset', 100]
                ]);

                  var options = {'is3D':true, 'height':170};

                  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                  chart.draw(data, options);
                } 

            }

                    
     });   
}
getStates(site){
this.sitedd = site;
           //console.log(site);
           let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

              // Get Assets
           
              let tagIdAsssetInventoryNo = [];
              
              this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
               .subscribe((data:  Array<object>) => {
                      
                      //console.log(data);

                      for(var data of data){
                        if(data.values.assigned_site_id == this.sitedd && data.values.exit_date_time == "null" && data.values.asset_inventory_no != undefined){
                            
                            tagIdAsssetInventoryNo[data.values.asset_inventory_no] = data.values.assigned_tag_id;
                           
                        }
                      }
             //console.log(tagIdAsssetInventoryNo); 
            // Get Asset States
            
            this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
             this.Tag_States_old = data;
                    //this.assetsStates = data;
                     //console.log(data);
                    //console.log(tagIdAsssetInventoryNo);
                    $('#status table .state_body').html('');
                    //console.log(tagIdAsssetInventoryNo);
                    for(var data of data){
                       for(var inv in tagIdAsssetInventoryNo){
                          if(data.values.tag_id == tagIdAsssetInventoryNo[inv]){
                           var dates = new Date(data.timestamp); 
                           var date = dates.getDate();
                           var month = dates.getMonth(); //Be careful! January is 0 not 1
                           var year = dates.getFullYear();
                           var hours = dates.getHours();
                           // Minutes part from the timestamp
                           var minutes = dates.getMinutes();
                           // Seconds part from the timestamp
                           var seconds = dates.getSeconds();
                           // Will display time in 10:30:23 format
                           var formattedTime = hours + ':' + minutes + ':' + seconds;
                           var dateString = date + "-" +(month + 1) + "-" + year+" "+formattedTime;
                           //var cls = "status online";

                           //(inv.length);
                           var invN = inv;
                           if(inv.length > 28)
                           {
                           
                             invN = inv.substr(0, 27) + "<br/>"  + inv.substr(27);
                            //console.log(invN, inv);

                           }

                           
                           
        $('#status table .state_body').append('<tr><td style="max-width: 185px;color: #42434c;">'+invN+'</td><td style="color: #42434c;">'+data.values.state+'</td><td style="color: #42434c;">'+dateString+'</td></tr>');
                                                    
                          
                             
                          }
                      }
                    }
                 
                   //console.log(this.assetsStates); 
                    
                });
                      
             });


}



//Get MapData
getMapLatLng(site){
//console.log(site);
if(site != this.sited){
  this.counters = 0;
    //console.log(this.plottedArrayTransit);
    //console.log(this.plottedArrayCheck);
    //console.log(this.plottedArrayTransfer);
    //console.log(this.plottedArrayOff);
    //console.log(this.plottedArrayClaim);
    //console.log(this.plottedArrayOut);

    for(var newinvn in this.plottedArrayTransit){
      if(newinvn != "diff"){
         var invnn = this.plottedArrayTransit[newinvn];
         this.markersTransit[invnn].setMap(null);
         this.markersTransit[invnn] = null;    
         //console.log(this.markersTransit);   
      }     
    }

    for(var newinvn in this.plottedArrayCheck){
      if(newinvn != "diff"){
         var invnn = this.plottedArrayCheck[newinvn];
         this.markersCheck[invnn].setMap(null);
         this.markersCheck[invnn] = null;    
         //console.log(this.markersCheck);   
      }
          
    }

    for(var newinvn in this.plottedArrayTransfer){
      if(newinvn != "diff"){
         var invnn = this.plottedArrayTransfer[newinvn];
         this.markersTransfer[invnn].setMap(null);
         this.markersTransfer[invnn] = null;    
         //console.log(this.markersTransfer);   
      }
          
    }

    for(var newinvn in this.plottedArrayOff){
      if(newinvn != "diff"){
         var invnn = this.plottedArrayOff[newinvn];
         this.markersOff[invnn].setMap(null);
         this.markersOff[invnn] = null;    
         //console.log(this.markersOff);   
      }
          
    }

    for(var newinvn in this.plottedArrayClaim){
      if(newinvn != "diff"){
         var invnn = this.plottedArrayClaim[newinvn];
         this.markersClaim[invnn].setMap(null);
         this.markersClaim[invnn] = null;    
         //console.log(this.markersClaim);   
      }
          
    }

    for(var newinvn in this.plottedArrayOut){
      if(newinvn != "diff"){
         var invnn = this.plottedArrayOut[newinvn];
         this.markersOut[invnn].setMap(null);
         this.markersOut[invnn] = null;    
         //console.log(this.markersOut);   
      }
          
    }

  this.markersTransit=[];
  this.markersCheck=[];
  this.markersTransfer=[];
  this.markersOff=[];
  this.markersClaim=[];
  this.markersOut=[];
  this.plottedArrayTransit = [];
  this.plottedArrayCheck = [];
  this.plottedArrayTransfer = [];
  this.plottedArrayOff = [];
  this.plottedArrayClaim = [];
  this.plottedArrayOut = [];
  this.assetStateTransit = [];
  this.assetStateCheck = [];
  this.assetStateTransfer = [];
  this.assetStateOff = [];
  this.assetStateClaim = [];
  this.assetStateOut = [];
  this.newArrayTransit = [];
  this.newArrayCheck = [];
  this.newArrayTransfer = [];
  this.newArrayOff = [];
  this.newArrayClaim = [];
  this.newArrayOut = [];
}
this.counters = this.counters + 1;
this.sited = site;
this.sitedd = site;
//console.log(this.counters);
  let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

      this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.sitesmap = data;
            //console.log(data);

           // Get Assets
             
               let tagIdAsssetInventoryNo = [];
              
              this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
               .subscribe((data:  Array<object>) => {
                      //this.assets = data;
                      //console.log(data);

                      for(var data of data){
                        if(data.values.assigned_site_id == this.sitedd && data.values.exit_date_time == "null" && data.values.asset_inventory_no != undefined){
                            
                            tagIdAsssetInventoryNo[data.values.asset_inventory_no] = data.values.assigned_tag_id;
                        }
                      }
                      
                  // Get Asset States
                    this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
                     .subscribe((data:  Array<object>) => {
                            //this.assets = data;
                            //console.log(data);
                            //console.log(tagIdAsssetInventoryNo);
                        
                      
                      for(var data of data){
                         for(var inv in tagIdAsssetInventoryNo){
                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'In-Transit'){

                               if(this.counters == 1){
                                   this.assetStateTransit.push(inv);
                                   this.plottedArrayTransit.push(inv); 
                                   //console.log(this.plottedArrayTransit);        

                              }else{
                                 this.counters = 2;
                                 this.newArrayTransit.push(inv);
                                 //console.log(this.newArrayTransit);
                              }                       
                               
                               
                            }
                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'Check-in'){

                               if(this.counters == 1){
                                   this.assetStateCheck.push(inv);
                                   this.plottedArrayCheck.push(inv); 
                                   //console.log(this.plottedArrayCheck);        

                              }else{
                                 this.counters = 2;
                                 this.newArrayCheck.push(inv);
                                 //console.log(this.newArrayCheck);
                              }                       
                               
                               
                            }

                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'Transfer Loading'){

                               if(this.counters == 1){
                                   this.assetStateTransfer.push(inv);
                                   this.plottedArrayTransfer.push(inv); 
                                   //console.log(this.plottedArrayTransfer);        

                              }else{
                                 this.counters = 2;
                                 this.newArrayTransfer.push(inv);
                                 //console.log(this.newArrayTransfer);
                              }                       
                               
                               
                            }

                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'Off-loading'){

                               if(this.counters == 1){
                                   this.assetStateOff.push(inv);
                                   this.plottedArrayOff.push(inv); 
                                   //console.log(this.plottedArrayOff);        

                              }else{
                                 this.counters = 2;
                                 this.newArrayOff.push(inv);
                                 //console.log(this.newArrayOff);
                              }                       
                               
                               
                            }

                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'Baggage Claim'){

                               if(this.counters == 1){
                                   this.assetStateClaim.push(inv);
                                   this.plottedArrayClaim.push(inv); 
                                   //console.log(this.plottedArrayClaim);        

                              }else{
                                 this.counters = 2;
                                 this.newArrayClaim.push(inv);
                                 //console.log(this.newArrayClaim);
                              }                       
                                 
                            }

                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'Check-out'){

                               if(this.counters == 1){
                                   this.assetStateOut.push(inv);
                                   this.plottedArrayOut.push(inv); 
                                   //console.log(this.plottedArrayOut);        

                              }else{
                                 this.counters = 2;
                                 this.newArrayOut.push(inv);
                                 //console.log(this.newArrayOut);
                              }                       
                               
                               
                            }
                        }
                      }
                    
                   // if(this.counters == 1){
                                  
                       // this.plottedArrayTransit = ["asset-003","asset-004","asset-005","asset-006"];
                       // this.assetStateTransit = ["asset-003","asset-004","asset-005","asset-006"];
                           

                   // }else{
                      // this.counters = 2;
                       //this.newArrayTransit = ["asset-001","asset-002","asset-003"];
                    //}
                    let LatLngArrayTransit = [];
                    let LatLngArrayCheck = [];
                    let LatLngArrayTransfer = [];
                    let LatLngArrayOff = [];
                    let LatLngArrayClaim = [];
                    let LatLngArrayOut = [];
                    for(let sites of this.sitesmap){
                      if(sites.values.site_id == this.sitedd){
                       //In-Transit
                       LatLngArrayTransit['top_right_lat'] = parseFloat(29.60920962820198);
                       LatLngArrayTransit['top_right_lng'] = parseFloat(71.36553477908296);
                       LatLngArrayTransit['bottom_left_lat'] = parseFloat(28.86003424063305);
                       LatLngArrayTransit['bottom_left_lng'] = parseFloat(67.2202558484189);
                      
                       //Check-in
                       LatLngArrayCheck['top_right_lat'] = parseFloat(32.667624659576866);
                       LatLngArrayCheck['top_right_lng'] = parseFloat(74.78815494042965);
                       LatLngArrayCheck['bottom_left_lat'] = parseFloat(31.990428418676494);
                       LatLngArrayCheck['bottom_left_lng'] = parseFloat(73.15840182763668);

                       //Transfer Loading
                       LatLngArrayTransfer['top_right_lat'] = parseFloat(32.77086359948652);
                       LatLngArrayTransfer['top_right_lng'] = parseFloat(70.94980655175777);
                       LatLngArrayTransfer['bottom_left_lat'] = parseFloat(32.02910873339352);
                       LatLngArrayTransfer['bottom_left_lng'] = parseFloat(69.57994876367184);

                       // Off-loading
                       LatLngArrayOff['top_right_lat'] = parseFloat(27.387340300643526);
                       LatLngArrayOff['top_right_lng'] = parseFloat(66.5171308484189);
                       LatLngArrayOff['bottom_left_lat'] = parseFloat(26.682766807133092);
                       LatLngArrayOff['bottom_left_lng'] = parseFloat(63.6606855359189);

                       // Baggage Claim
                       LatLngArrayClaim['top_right_lat'] = parseFloat(27.815722197414644);
                       LatLngArrayClaim['top_right_lng'] = parseFloat(69.2856855359189);
                       LatLngArrayClaim['bottom_left_lat'] = parseFloat(27.270219033075055);
                       LatLngArrayClaim['bottom_left_lng'] = parseFloat(67.3520917859189);

                       // Check-out
                       LatLngArrayOut['top_right_lat'] = parseFloat(26.368211854228328);
                       LatLngArrayOut['top_right_lng'] = parseFloat(70.0327558484189);
                       LatLngArrayOut['bottom_left_lat'] = parseFloat(25.657335777173245);
                       LatLngArrayOut['bottom_left_lng'] = parseFloat(68.7583417859189);
                                       
                      }   
                    }

                      
                if(this.counters == 1){
                       
                  //console.log(LatLngArrayTransit);
                  //console.log(LatLngArrayCheck);
                  //console.log(LatLngArrayTransfer);
                  //console.log(LatLngArrayOff);
                  //console.log(LatLngArrayClaim);
                  //console.log(LatLngArrayOut);
                  function getRandom_marker(bounds){
                       var lat_min = bounds.getSouthWest().lat(),
                           lat_range = bounds.getNorthEast().lat() - lat_min,
                           lng_min = bounds.getSouthWest().lng(),
                           lng_range = bounds.getNorthEast().lng() - lng_min;

                       return new google.maps.LatLng(lat_min + (Math.random() * lat_range), 
                                                     lng_min + (Math.random() * lng_range));
                     }
           
                   var rectangleTransit = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0,
                    map: this.map,
                    bounds: {
                      north: LatLngArrayTransit['top_right_lat'],
                      south: LatLngArrayTransit['bottom_left_lat'],
                      east:  LatLngArrayTransit['top_right_lng'],
                      west:  LatLngArrayTransit['bottom_left_lng']
                    }
                  });

                  
                  //console.log(LatLngArrayTransit);
                  this.recBoundsTransit = rectangleTransit.getBounds();
                  var cent = this.recBoundsTransit.getCenter();
                  this.map.setCenter(cent);
                  //this.map.fitBounds(this.recBoundsTransit);
                  //this.map.setZoom(6);

                  // rectangle check in
                  var rectangleCheck = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0,
                    map: this.map,
                    bounds: {
                      north: LatLngArrayCheck['top_right_lat'],
                      south: LatLngArrayCheck['bottom_left_lat'],
                      east:  LatLngArrayCheck['top_right_lng'],
                      west:  LatLngArrayCheck['bottom_left_lng']
                    }
                  });

                   //console.log(LatLngArrayCheck);
                     this.recBoundsCheck = rectangleCheck.getBounds();
                     //this.map.fitBounds(this.recBoundsOff);
                     //this.map.setZoom(6);

                  // rectangle Transfer Loading
                  var rectangleTransfer = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0,
                    map: this.map,
                    bounds: {
                      north: LatLngArrayTransfer['top_right_lat'],
                      south: LatLngArrayTransfer['bottom_left_lat'],
                      east:  LatLngArrayTransfer['top_right_lng'],
                      west:  LatLngArrayTransfer['bottom_left_lng']
                    }
                  });

                   //console.log(LatLngArrayTransfer);
                     this.recBoundsTransfer = rectangleTransfer.getBounds();
                     //this.map.fitBounds(this.recBoundsTransfer);
                     //this.map.setZoom(6);

                  // rectangle Off-loading
                  var rectangleOff = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0,
                    map: this.map,
                    bounds: {
                      north: LatLngArrayOff['top_right_lat'],
                      south: LatLngArrayOff['bottom_left_lat'],
                      east:  LatLngArrayOff['top_right_lng'],
                      west:  LatLngArrayOff['bottom_left_lng']
                    }
                  });

                     //console.log(LatLngArrayOff);
                     this.recBoundsOff = rectangleOff.getBounds();
                     //this.map.fitBounds(this.recBoundsOff);
                     //this.map.setZoom(6);

                  // rectangle Baggage Claim
                  var rectangleClaim = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0,
                    map: this.map,
                    bounds: {
                      north: LatLngArrayClaim['top_right_lat'],
                      south: LatLngArrayClaim['bottom_left_lat'],
                      east:  LatLngArrayClaim['top_right_lng'],
                      west:  LatLngArrayClaim['bottom_left_lng']
                    }
                  });

                     //console.log(LatLngArrayCheck);
                     this.recBoundsClaim = rectangleClaim.getBounds();
                     //this.map.fitBounds(this.recBoundsClaim);
                     //this.map.setZoom(6);

                  // rectangle check out
                  var rectangleOut = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0,
                    map: this.map,
                    bounds: {
                      north: LatLngArrayOut['top_right_lat'],
                      south: LatLngArrayOut['bottom_left_lat'],
                      east:  LatLngArrayOut['top_right_lng'],
                      west:  LatLngArrayOut['bottom_left_lng']
                    }
                  });

                   //console.log(LatLngArrayOut);
                     this.recBoundsOut = rectangleOut.getBounds();
                     //this.map.fitBounds(this.recBoundsOut);
                     //this.map.setZoom(6);
                     this.icon = {
                                    url: "assets/images/tag.png", // url
                                    scaledSize: new google.maps.Size(25, 35), // scaled size
                                    labelOrigin: new google.maps.Point(25,0)
                                };
                      // In-Transit State
                      for (var i = 0; i < this.assetStateTransit.length; i++) {
                      var invN = this.assetStateTransit[i];
                       this.markersTransit[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBoundsTransit), 
                         map: this.map,
                         icon:this.icon,
                         //label: {text: this.assetStateTransit[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateTransit[i]
                       });  

                     }
                     // Check-in state
                     for (var i = 0; i < this.assetStateCheck.length; i++) {
                      var invN = this.assetStateCheck[i];
                       this.markersCheck[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBoundsCheck), 
                         map: this.map,
                         icon:this.icon,
                         //label: {text: this.assetStateCheck[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateCheck[i]
                       });  

                     }
                     // Transfer Loading State
                     for (var i = 0; i < this.assetStateTransfer.length; i++) {
                      var invN = this.assetStateTransfer[i];
                       this.markersTransfer[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBoundsTransfer), 
                         map: this.map,
                         icon:this.icon,
                         //label: {text: this.assetStateTransfer[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateTransfer[i]
                       });  

                     }
                     // Off-loading State
                     for (var i = 0; i < this.assetStateOff.length; i++){
                      var invN = this.assetStateOff[i];
                       this.markersOff[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBoundsOff), 
                         map: this.map,
                         icon:this.icon,
                         //label: {text: this.assetStateOff[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateOff[i]
                       });  
                     }
 
                     // Baggage Claim State
                     for (var i = 0; i < this.assetStateClaim.length; i++) {
                      var invN = this.assetStateClaim[i];
                       this.markersClaim[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBoundsClaim), 
                         map: this.map,
                         icon:this.icon,
                         //label: {text: this.assetStateClaim[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateClaim[i]
                       });  

                     }

                     // Check-out
                     for (var i = 0; i < this.assetStateOut.length; i++) {
                      var invN = this.assetStateOut[i];
                       this.markersClaim[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBoundsOut), 
                         map: this.map,
                         icon:this.icon,
                         //label: {text: this.assetStateOut[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateOut[i]
                       });  

                     }
                     
                    
                    }

                    if(this.counters != 1){
                      // check whether plottedArray and  newArray are equal or not
                      //var is_same = this.plottedArrayTransit.length == this.newArrayTransit.length && this.plottedArrayTransit.every(function(element, index) {
                       //   return element === this.newArrayTransit[index]; 
                      //});
                      //if(!is_same){
                        
                    function getRandom_marker(bounds) {
                       var lat_min = bounds.getSouthWest().lat(),
                           lat_range = bounds.getNorthEast().lat() - lat_min,
                           lng_min = bounds.getSouthWest().lng(),
                           lng_range = bounds.getNorthEast().lng() - lng_min;

                       return new google.maps.LatLng(lat_min + (Math.random() * lat_range), 
                                                     lng_min + (Math.random() * lng_range));
                     }
           
                   
                    Array.prototype.diff = function(a){
                        return this.filter(function(i) {return a.indexOf(i) < 0;});
                    };
                    
                    
                    //console.log(this.newArrayTransit);
                    //console.log(this.plottedArrayTransit);

                      var TransitDif1 = this.newArrayTransit.diff(this.plottedArrayTransit);

                      //console.log("add these markers: "+ TransitDif1);
                      for(i=0; i<TransitDif1.length; i++){
                        //console.log(TransitDif1[i]);
                        var invN = TransitDif1[i];
                         this.markersTransit[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBoundsTransit), 
                           map: this.map,
                           icon:this.icon,
                           //label: {text: TransitDif1[i], color: "#03376F",fontWeight: "bold"},
                           title: TransitDif1[i]
                         });   
                      
                      }
                      var TransitDif2 = this.plottedArrayTransit.diff(this.newArrayTransit); 
                      //console.log("remove these markers: "+TransitDif2);
                      for(i=0; i<TransitDif2.length; i++){
                        //console.log(TransitDif2[i]);
                        var invN = TransitDif2[i];
                        this.markersTransit[invN].setMap(null);
                        this.markersTransit[invN] = null;
                      }

                      this.plottedArrayTransit=this.newArrayTransit;
                      this.assetStateTransit = this.newArrayTransit;
                      this.newArrayTransit = [];
                       
                    //}
                        
                    //console.log(this.markersTransit);
                   //markersTransit[invN].setMap(null);
                    //markersTransit[2]=null;


                    //console.log(this.newArrayCheck);
                    //console.log(this.plottedArrayCheck);

                      var CheckDif1 = this.newArrayCheck.diff(this.plottedArrayCheck);

                      //console.log("add these markers: "+ CheckDif1);
                      for(i=0; i<CheckDif1.length; i++){
                        //console.log(CheckDif1[i]);
                        var invN = CheckDif1[i];
                         this.markersCheck[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBoundsCheck), 
                           map: this.map,
                           icon:this.icon,
                           //label: {text: CheckDif1[i], color: "#03376F",fontWeight: "bold"},
                           title: CheckDif1[i]
                         });   
                      
                      }
                      var CheckDif2 = this.plottedArrayCheck.diff(this.newArrayCheck); 
              
                      //console.log("remove these markers: "+CheckDif2);
                      for(i=0; i<CheckDif2.length; i++){
                        //console.log(CheckDif2[i]);
                        var invN = CheckDif2[i];
                        this.markersCheck[invN].setMap(null);
                        this.markersCheck[invN] = null;
                      }

                      this.plottedArrayCheck=this.newArrayCheck;
                      this.assetStateCheck = this.newArrayCheck;
                      this.newArrayCheck = [];
                       
                    //}
                        
                     //console.log(this.markersCheck);
                     //markersCheck[invN].setMap(null);
                     //markersCheck[2]=null;

                    //console.log(this.newArrayTransfer);
                    //console.log(this.plottedArrayTransfer);

                      var TransferDif1 = this.newArrayTransfer.diff(this.plottedArrayTransfer);

                      //console.log("add these markers: "+ TransferDif1);
                      for(i=0; i<TransferDif1.length; i++){
                        //console.log(TransferDif1[i]);
                        var invN = TransferDif1[i];
                         this.markersTransfer[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBoundsTransfer), 
                           map: this.map,
                           icon:this.icon,
                           //label: {text: TransferDif1[i], color: "#03376F",fontWeight: "bold"},
                           title: TransferDif1[i]
                         });   
                      
                      }
                      var TransferDif2 = this.plottedArrayTransfer.diff(this.newArrayTransfer); 
                      
                      //console.log("remove these markers: "+TransferDif2);
                      for(i=0; i<TransferDif2.length; i++){
                        //console.log(TransferDif2[i]);
                        var invN = TransferDif2[i];
                        this.markersTransfer[invN].setMap(null);
                        this.markersTransfer[invN] = null;
                      }

                      this.plottedArrayTransfer=this.newArrayTransfer;
                      this.assetStateTransfer = this.newArrayTransfer;
                      this.newArrayTransfer = [];
                       
                    //}
                        
                    //console.log(this.markersTransfer);
                   //markersTransfer[invN].setMap(null);
                    //markersTransfer[2]=null;

                    //console.log(this.newArrayOff);
                    //console.log(this.plottedArrayOff);

                      var OffDif1 = this.newArrayOff.diff(this.plottedArrayOff);

                      //console.log("add these markers: "+ OffDif1);
                      for(i=0; i<OffDif1.length; i++){
                        //console.log(OffDif1[i]);
                        var invN = OffDif1[i];
                         this.markersOff[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBoundsOff), 
                           map: this.map,
                           icon:this.icon,
                           //label: {text: OffDif1[i], color: "#03376F",fontWeight: "bold"},
                           title: OffDif1[i]
                         });   
                      
                      }
                      var OffDif2 = this.plottedArrayOff.diff(this.newArrayOff); 
                      
                      //console.log("remove these markers: "+OffDif2);
                      for(i=0; i<OffDif2.length; i++){
                        //console.log(OffDif2[i]);
                        var invN = OffDif2[i];
                        this.markersOff[invN].setMap(null);
                        this.markersOff[invN] = null;
                      }

                      this.plottedArrayOff=this.newArrayOff;
                      this.assetStateOff = this.newArrayOff;
                      this.newArrayOff = [];
                       
                    //}
                        
                    //console.log(this.markersOff);
                   //markersOff[invN].setMap(null);
                    //markersOff[2]=null;

                    //console.log(this.newArrayClaim);
                    //console.log(this.plottedArrayClaim);

                      var ClaimDif1 = this.newArrayClaim.diff(this.plottedArrayClaim);

                      //console.log("add these markers: "+ ClaimDif1);
                      for(i=0; i<ClaimDif1.length; i++){
                        //console.log(ClaimDif1[i]);
                        var invN = ClaimDif1[i];
                         this.markersClaim[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBoundsClaim), 
                           map: this.map,
                           icon:this.icon,
                           //label: {text: ClaimDif1[i], color: "#03376F",fontWeight: "bold"},
                           title: ClaimDif1[i]
                         });   
                      
                      }
                      var ClaimDif2 = this.plottedArrayClaim.diff(this.newArrayClaim); 
                      
                      //console.log("remove these markers: "+ClaimDif2);
                      for(i=0; i<ClaimDif2.length; i++){
                        //console.log(ClaimDif2[i]);
                        var invN = ClaimDif2[i];
                        this.markersClaim[invN].setMap(null);
                        this.markersClaim[invN] = null;
                      }

                      this.plottedArrayClaim=this.newArrayClaim;
                      this.assetStateClaim = this.newArrayClaim;
                      this.newArrayClaim = [];
                       
                    //}
                        
                    //console.log(this.markersClaim);
                   //markersClaim[invN].setMap(null);
                    //markersClaim[2]=null;

                    //console.log(this.newArrayOut);
                    //console.log(this.plottedArrayOut);

                      var OutDif1 = this.newArrayOut.diff(this.plottedArrayOut);

                      //console.log("add these markers: "+ OutDif1);
                      for(i=0; i<OutDif1.length; i++){
                        //console.log(OutDif1[i]);
                        var invN = OutDif1[i];
                         this.markersOut[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBoundsOut), 
                           map: this.map,
                           icon:this.icon,
                           //label: {text: OutDif1[i], color: "#03376F",fontWeight: "bold"},
                           title: OutDif1[i]
                         });   
                      
                      }
                      var OutDif2 = this.plottedArrayOut.diff(this.newArrayOut); 
                      
                      //console.log("remove these markers: "+OutDif2);
                      for(i=0; i<OutDif2.length; i++){
                        //console.log(OutDif2[i]);
                        var invN = OutDif2[i];
                        this.markersOut[invN].setMap(null);
                        this.markersOut[invN] = null;
                      }

                      this.plottedArrayOut=this.newArrayOut;
                      this.assetStateOut = this.newArrayOut;
                      this.newArrayOut = [];
                       
                    //}
                        
                    //console.log(this.markersOut);
                   //markersOut[invN].setMap(null);
                    //markersOut[2]=null;
                }   
                
               $('#spinner').removeClass('fa-spinner');
               $('#siteValue').attr('disabled', false); 
               
               if(this.netSymbol == "true"){
                  $('#siteStatus').hide();
               }else{
                  $('#siteStatus').show();
               }
                            
            });
         });
          
  
}
            
       
}   

AnalyticsAgainstAsset(){
$('[href="#step6"]').attr('data-target','');
          let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 
          
              
              this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
               .subscribe((data:  Array<object>) => {
                      
                      //console.log(data);
                      this.stateInv=$('#assets').val();
                      for(var data of data){
                        if(data.values.assigned_site_id == this.sitedd && data.values.exit_date_time == "null" && data.values.asset_inventory_no == this.stateInv){
                            
                            var tags_idd = data.values.assigned_tag_id;
                           
                        }
                      }
          // Get Assets state  
          this.http.get(`https://securene.co:9445/analytics/tables/TAGS_STATES_DATA`, options)
             .subscribe((data:  Array<object>) => {
                    this.StateAgainstAsset = data;
                    //console.log(this.StateAgainstAsset);
  
            $('.status-anc').removeClass('active');
            $('.status-anc').removeClass('active2');
            $('.step').removeClass('steps');
            $('.step').removeClass('steps2');
            
            for(var data of this.StateAgainstAsset){
                  if(data.values.tag_id == tags_idd){

                 //console.log(data);
                // console.log(data.values.state+','+data.values.count);
                 if(data.values.state == 'Check-in'){
                     $('[href="#step1"]').addClass('active');    
                 }

                 if(data.values.state == 'Transfer Loading'){
                     $('[href="#step1"]').addClass('active');
                     $('[href="#step2"]').addClass('active');
                 }
                 if(data.values.state == 'In-Transit'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active'); 
                 }
                 if(data.values.state == 'Off-loading'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active');
                    $('[href="#step4"]').addClass('active'); 
                 }
                 if(data.values.state == 'Baggage Claim'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active'); 
                    $('[href="#step4"]').addClass('active');
                    $('[href="#step5"]').addClass('active');
                 }
                 if(data.values.state == 'Check-out'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active'); 
                    $('[href="#step4"]').addClass('active');
                    $('[href="#step5"]').addClass('active');
                    $('[href="#step6"]').addClass('active');
                 }

                if(data.values.state == 'Check-in Missing'){
                     $('[href="#step1"]').addClass('active2');    
                 }
                 
                 if(data.values.state == 'Transfer Loading Missing'){
                     $('[href="#step1"]').addClass('active');
                     $('[href="#step2"]').addClass('active2');
                 }
                 if(data.values.state == 'In-Transit Missing'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active2'); 
                 }
                 if(data.values.state == 'Off-loading Missing'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active');
                    $('[href="#step4"]').addClass('active2'); 
                 }
                 if(data.values.state == 'Baggage Claim Missing'){
                    $('[href="#step1"]').addClass('active');
                    $('[href="#step2"]').addClass('active');
                    $('[href="#step3"]').addClass('active'); 
                    $('[href="#step4"]').addClass('active');
                    $('[href="#step5"]').addClass('active2');
                 }
                 
                 }
              
            }
           var stp1=false;
           var stp2=false;
           var stp3=false;
           var stp4=false;
           var stp5=false;
          
           if($("[href='#step1']").hasClass("active")){
            $('.stepCount1').html('<img src="assets/images/built/checkWhite.png" style="margin-top: 12px;">'); 
            $('.stepCount1').addClass('steps');
              stp1=true;
           }else{
            $('.stepCount1').html('<img src="assets/images/built/check.png" style="margin-top: 12px;">');
           }
           if($("[href='#step1']").hasClass("active2")){
            $('.stepCount1').html('<img src="assets/images/built/checkWhite.png" style="margin-top: 12px;">'); 
            $('.stepCount1').addClass('steps2');
           }else{
              if(stp1!=true){
                $('.stepCount1').html('<img src="assets/images/built/check.png" style="margin-top: 12px;">');
              }
              
           }
           if($("[href='#step2']").hasClass("active")){
            $('.stepCount2').html('<img src="assets/images/built/transferWhite.png" style="margin-top: 12px;">'); 
            $('.stepCount2').addClass('steps');
              stp2=true;
           }else{
            $('.stepCount2').html('<img src="assets/images/built/transfer.png" style="margin-top: 12px;">');
           }
           if($("[href='#step2']").hasClass("active2")){
            $('.stepCount2').html('<img src="assets/images/built/transferWhite.png" style="margin-top: 12px;">'); 
            $('.stepCount2').addClass('steps2');

           }else{
             if(stp2!=true){
              $('.stepCount2').html('<img src="assets/images/built/transfer.png" style="margin-top: 12px;">');
             }
           }
           if($("[href='#step3']").hasClass("active")){
            $('.stepCount3').html('<img src="assets/images/built/transitWhite.png" style="margin-top: 12px;">');
            $('.stepCount3').addClass('steps');
              stp3=true;
           }else{
            $('.stepCount3').html('<img src="assets/images/built/transit.png" style="margin-top: 12px;">');
           }
           if($("[href='#step3']").hasClass("active2")){
            $('.stepCount3').html('<img src="assets/images/built/transitWhite.png" style="margin-top: 12px;">');
            $('.stepCount3').addClass('steps2');
           }else{
             if(stp3!=true){
              $('.stepCount3').html('<img src="assets/images/built/transit.png" style="margin-top: 12px;">');
             }
           }
           if($("[href='#step4']").hasClass("active")){
            $('.stepCount4').html('<img src="assets/images/built/offWhite.png" style="margin-top: 12px;">');
            $('.stepCount4').addClass('steps');
              stp4=true;
           }else{
            $('.stepCount4').html('<img src="assets/images/built/off.png" style="margin-top: 12px;">');
           }
           if($("[href='#step4']").hasClass("active2")){
            $('.stepCount4').html('<img src="assets/images/built/offWhite.png" style="margin-top: 12px;">');
            $('.stepCount4').addClass('steps2');
           }else{
              if(stp4!=true){
               $('.stepCount4').html('<img src="assets/images/built/off.png" style="margin-top: 12px;">');
              }
           }
           if($("[href='#step5']").hasClass("active")){
            $('.stepCount5').html('<img src="assets/images/built/claimWhite.png" style="margin-top: 12px;">'); 
            $('.stepCount5').addClass('steps');
              stp5=true;
           }else{
            $('.stepCount5').html('<img src="assets/images/built/claim.png" style="margin-top: 12px;">');
           }
           if($("[href='#step5']").hasClass("active2")){
            $('.stepCount5').html('<img src="assets/images/built/claimWhite.png" style="margin-top: 12px;">'); 
            $('.stepCount5').addClass('steps2');
           }else{
              if(stp5!=true){
               $('.stepCount5').html('<img src="assets/images/built/claim.png" style="margin-top: 12px;">');
              }
           }
           if($("[href='#step6']").hasClass("active")){
            $('.stepCount6').html('<img src="assets/images/built/outWhite.png" style="margin-top: -4px;">'); 
            $('.stepCount6').addClass('steps');
           }else{
            $('.stepCount6').html('<img src="assets/images/built/out.png" style="margin-top: -4px;">');
           }
           
                    
     });
     });   
  
}

getAssetInfo(asset){
    //this.assetVal=asset;
    let httpHeaders = new HttpHeaders({
               'Content-Type':'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               'headers': httpHeaders
           };   

    // Get Assets   

    
    this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
     .subscribe((data:  Array<object>) => {
           
            for(var info of data){
              if(info.values.asset_inventory_no == asset){
                this.assetInfo = info;
              }
            }
           //console.log(this.assetInfo);
            
    }); 
    
}
public getAlerts(){
     this.alertsCounters = this.alertsCounters+1;  
       
          let httpHeaders = new HttpHeaders({
             'Content-Type' : 'application/json',
             'Authorization':'Basic YWRtaW46YWRtaW4='
         });
        let options = {
         headers: httpHeaders
         }; 

         this.http.get(`https://securene.co:9445/analytics/tables/TAGS_ALERT_EVENTS5/recordcount`, options)
     .subscribe((data:  Array<object>) => {
            //console.log(data);
            this.AlertsCount = data;    
            var currentDate = new Date();
            var currentUnix = currentDate.getTime();
            var minusHund=this.AlertsCount-100;
                if(this.alertsCounters == 1){ 
                  this.http.get(`https://securene.co:9445/analytics/tables/TAGS_ALERT_EVENTS5/0/`+currentUnix+`/`+minusHund+`/100`,options)
                                   .subscribe((data:  Array<object>) => {
                                          
                                          this.alertss=data;  
                                          //console.log(this.alertss);
                                         
                                           for (let alertss of this.alertss) {

                                    if(alertss.values.last_alert_id == 5 || alertss.values.last_alert_id == 6){
                                      this.assetAndAlertobj.unshift({state: alertss.values.event, siteInv: alertss.values.site_name, timestamp: alertss.timestamp});   
                                          }else{
                                            this.assetAndAlertobj.unshift({state: alertss.values.event, siteInv: alertss.values.asset_inventory_no, timestamp: alertss.timestamp });
                                          }

                                       } 
                                          
                                      //console.log(this.assetAndAlertobj);  
                                      //this.ass=this.assetAndAlertobj.length;
  
                                    $("#alerts-spinner").hide();      
                                });
                            }
                              if(this.alertsCounters != 1){
                                var currentDate = this.date = new Date();
                                         
                                         var dateString = currentDate.getTime();
                                         //alert(this.alertsCounters);
                                         //console.log(currentDate);
                                            if(this.alertsCounters == 2){
                                             this.LastAlertTime = this.alertss[this.alertss.length-1].timestamp+1;
                                             //console.log(this.LastAlertTime);
                                            }else{
                                               if(this.alertsss.length > 0){
                                                  this.LastAlertTime = this.alertsss[this.alertsss.length-1].timestamp+1;
                                               }  
                                            }
                                              
                                         //console.log(LastAlertTime);
                                
                                    this.http.get(`https://securene.co:9445/analytics/tables/TAGS_ALERT_EVENTS5/`+this.LastAlertTime+`/`+dateString,options)
                                   .subscribe((data:  Array<object>) => {

                                          this.alertsss=data;  
                                          //console.log(this.alertsss);
                                          
                                          for (let alertss of this.alertsss) {

                                         if(alertss.values.event == 'Check-in Missing' || alertss.values.event == 'Transfer Loading Missing' || alertss.values.event == 'In-Transit Missing' || alertss.values.event == 'Off-loading Missing' || alertss.values.event == 'Baggage Claim Missing'){
                                                 $('#AseetInv').html(alertss.values.asset_inventory_no+": "+alertss.values.event);
                                                 $(".Top-Right-Alert").slideDown('slow');
                                                  setTimeout(function(){
                                                    $(".Top-Right-Alert").slideUp('slow');
                                                  },5000);
                                              }

                                        if(alertss.values.last_alert_id == 5 || alertss.values.last_alert_id == 6){
                                      this.assetAndAlertobj.unshift({state: alertss.values.event, siteInv: alertss.values.site_name, timestamp: alertss.timestamp });   
                                          }else{
                                            this.assetAndAlertobj.unshift({state: alertss.values.event, siteInv: alertss.values.asset_inventory_no, timestamp: alertss.timestamp });
                                          }

                                       }
                                       
                                      // the bellow for loop remove first objects from the array from start
                                          if(this.assetAndAlertobj.length > 100){
                                            for(var i=0; i < this.alertsss.length; i++){
                                              this.assetAndAlertobj.pop();
                                            }
                                          }
                                      //console.log(this.assetAndAlertobj);  
                                      //this.ass=this.assetAndAlertobj.length;

                                      });
                                    
                                  this.alertsCounters = 3;
                              }
                               });
                                                                
                                
}
  
    themeColors = this.colorConfig.get().colors;

    //Donut Chart Config
    public donutChartLabels:string[] = ["Texas", "Utah", "Georgia", "Nebraska"];
    public donutChartData:number[] = [300, 500, 100, 200];
    public donutChartType:string = 'doughnut';
    public donutChartLegend:boolean = false;
    public dountChartOptions:any = {
        cutoutPercentage: 75,
        maintainAspectRatio: false
    }
    public donutChartColors: any = [{ 
        backgroundColor: [this.themeColors.info, this.themeColors.primary, this.themeColors.success, this.themeColors.gray],
        pointBackgroundColor : [this.themeColors.info, this.themeColors.primary, this.themeColors.success, this.themeColors.gray]
    }];

    //Line Chart Config
    public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartData:Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40, 37, 54, 76, 63, 62], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90, 43, 65 ,76, 87, 85], label: 'Series B'}
    ];
    public lineChartOptions:any = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: false
                }
            ]
        }
    };
    public lineChartLegend:boolean = false;
    public lineChartType:string = 'line';
    public lineChartColors:Array<any> = [
        {
            backgroundColor: this.themeColors.infoInverse,
            borderColor: this.themeColors.info
        },
        { 
            backgroundColor: this.themeColors.successInverse,
            borderColor: this.themeColors.success
        }
    ];

    ngAfterViewInit() {
        let themeColors = this.colorConfig.get().colors;

        var sparklineBarData1 = [32, 38, 36, 35, 38, 37, 35, 34, 36, 38, 36, 37, 35, 34, 37, 38, 38];
        
        //Sparkline
        (<any>$('#dahboard-bar-option') ).sparkline(sparklineBarData1,  
        {
            type: 'bar',
            height: '60',
            barWidth: 3,
            barSpacing: 8,
            barColor: themeColors.info
        });

        var map;
        if (AmCharts.isReady) {
            createChart();
        } 
        else {
            AmCharts.ready(function () {
                createChart();
            });
        }

        function createChart() {
            map = new AmCharts.AmMap();

            map.colorSteps = 0;

            map.imagesSettings = {
                rollOverColor: themeColors.info,
                rollOverScale: 1.5,
                selectedScale: 1.5,
                selectedColor: themeColors.info,
                color: themeColors.info
            }

            var dataProvider = {
                mapVar: AmCharts.maps.usaLow,
                
                areas: [{
                    id: "US-TX",
                    color: themeColors.info,
                    rollOverColor: themeColors.info,
                    outlineColor: "#b5bbd7"
                },
                {
                    id: "US-UT",
                    color: themeColors.primary,
                    rollOverColor: themeColors.primary,
                    outlineColor: "#b5bbd7"
                },
                {
                    id: "US-GA",
                    color: themeColors.success,
                    rollOverColor: themeColors.success,
                    outlineColor: "#b5bbd7"
                }, 
                {
                    id: "US-NE",
                    color: themeColors.gray,
                    rollOverColor: themeColors.gray,
                    outlineColor: "#b5bbd7"
                }]
            };

            map.areasSettings = {
                autoZoom: true, 
                unlistedAreasColor: themeColors.white,
                unlistedAreasOutlineColor: "#b5bbd7", 
                descriptionWindowHeight:300,
                descriptionWindowWidth:300,
                descriptionWindowTop:400,
                descriptionWindowLeft:300,
                outlineAlpha: 1,
                outlineThickness: 1.5,
                rollOverOutlineColor: themeColors.white,
            };
            map.dataProvider = dataProvider;

            var valueLegend = new AmCharts.ValueLegend();
            valueLegend.right = 10;
            valueLegend.minValue = "";
            valueLegend.maxValue = "";
            map.valueLegend = valueLegend;

            map.write("dashboardMap");


        }

    } 
}






















