
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
 import {Router,ActivatedRoute } from '@angular/router';



@Component({
    templateUrl: 'dashboardMap.html'
})

export class DashboardMapComponent implements OnInit{

    public isCompleted: any;
    public onStep2Next: any;
    public onStep3Next: any;
    public onComplete: any;
    public lat: number;
    public lng: number;
    public discoveredCount = 0;
    public undiscoveredCount = 0;
    public unauthorizedCount = 0;
    public stolenCount = 0;
    public transitCount = 0;
    public assetStateCount = 0;
    public sited="";
    public markers = [];
    public map = "";
    public recBounds = "";
    public icon = "";
    public assetStateRegisteredDiscovered = [];
    public plottedArray = [];
    public newArray = [];
    public counters = 0;
    public alertsCounters = 0;
    public  LastAlertTime = "";
    public mapI = "";
     
     public icon = "";

     //public that = '';

     public cityN = '';

     public varFunc = '';

 
    
    
    


    constructor(private svc: ApiService,private route: ActivatedRoute,  private router: Router, private http: HttpClient, private colorConfig:ThemeConstants, private globals: GlobalsService){

 
    }
    
    private  sites:  Array<object> = [];
    private  assets:  Array<object> = [];
    private  assetAndAlertobj:  Array<object> = [];
    private  AlertsAssets:  Array<object> = [];
    private  assetInfo:  Array<object> = [];
    private  alerts:  Array<object> = [];
    private  alertss:  Array<object> = [];
    private  assetsStates: Array<object> =[];
    private  sitesmap:  Array<object> = [];


    private  sitesMap:  Array<object> = [];

    private  statesN:  Array<object> = [];
    private  that:  any;



    ngOnInit() {


         window.that = this;
         console.log(window.that);

         this.statesN = ["Punjab", "Sindh", "Khyber Pakhton khawa","Baluchistan", "Gilgit Baltistan", "Azad Kashmir"];

                //this.getPieChart();
        this.InitMap();
       //this.getSites();
        //this.getAlerts();
      //setInterval(()=>{
       //  this.getAlerts();
      //}, 10000);
               
    }

   getSites(city){

      //alert(city);
      this.cityN = city;
       var httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        var options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.sites = data;
            console.log(data);
            var length = data.length;
            var myLatLng = new google.maps.LatLng(0,0);
                        this.mapI = new google.maps.Map(document.getElementById("googleMap"),
                        {
                            zoom: 15,
                            center: myLatLng,
                            //mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
                        this.sitesMap = [];
                        var bounds  = new google.maps.LatLngBounds();
            for(var i = 0; i<length; i++){
              
              if(data[i].values.region.split('-')[0] == city || data[i].values.region.split('-')[1] == city){



                this.sitesMap.unshift({  site_id: data[i].values.site_id, site_name: data[i].values.site_name });

             
             // console.log(data[i].values.bottom_left_lat,data[i].values.bottom_left_lng);
              initialize(data[i].values.bottom_left_lat,data[i].values.bottom_left_lng, data[i].values.top_right_lat,data[i].values.top_right_lng, data[i].values.site_name,this.mapI,data[i].values.site_id,bounds);

              }

            
            }
//console.log(this.sitesMap);
              function initialize(a,b,c,d, siteName, mapIndex, siteId, bounds)
                    {
                     
                         //var siteStatus = siteName.substr(siteName.indexOf("-") + 1);
                         var siteStatus = 'Active';
                         var myLatLng = new google.maps.LatLng(a,b);
                         var myLatLng1 = new google.maps.LatLng(c,d);

                         bounds.extend(myLatLng);
                         bounds.extend(myLatLng1);
                         if(siteStatus == "Active"){
                                    var url = 'assets/images/airport_active.png';
                                }
                                else
                                {
                                    var url = 'assets/images/airport_inactive.png';
                                }

                        var marker = new google.maps.Marker(
                        {
                            position: myLatLng,
                            map: mapIndex,
                            title: siteName,
                            label: {text: siteName, color: "#03376F",fontWeight: "bold"},
                            icon: {
                              url: url,
                              scaledSize: new google.maps.Size(35, 35),
                              labelOrigin: new google.maps.Point(17, 40 ),
                            },
                            siteId: siteId,
                            
                        });

                        var marker1 = new google.maps.Marker(
                        {
                            position: myLatLng1,
                            map: mapIndex,
                            title: siteName,
                            label: {text: siteName, color: "#03376F",fontWeight: "bold"},
                            icon: {
                              url: url,
                              scaledSize: new google.maps.Size(35, 35),
                              labelOrigin: new google.maps.Point(17, 40 ),
                            },
                            siteId: siteId,
                            
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                            //alert(this.siteId);
                            //this.router.navgateURL(['/alerts', 5]);
                            window.location.href = 'https://securene.co:4200/#/dashboard/'+this.siteId;  // https://securene.co:
                        });
                        google.maps.event.addListener(marker1, 'click', function() {
                            //alert(this.siteId);
                            //this.router.navgateURL(['/alerts', 5]);
                            window.location.href = 'https://securene.co:4200/#/dashboard/'+this.siteId;  // https://securene.co:
                        });
                       // console.log(marker);
                        mapIndex.fitBounds(bounds);     
                        mapIndex.panToBounds(bounds);     

                        var line = new google.maps.Polyline({
                          path: [
                              myLatLng, 
                              myLatLng1
                          ],
                          strokeColor: "#1DA1F2",
                          strokeOpacity: 1.0,
                          strokeWeight: 5,
                          map: mapIndex,
                          siteId: siteId
                      });
                      google.maps.event.addListener(line, 'click', function() {
                            //alert(this.siteId);
                            //this.router.navgateURL(['/alerts', 5]);
                            window.location.href = 'https://securene.co:4200/#/dashboard/'+this.siteId;  // https://securene.co:
                        });
                    }
            //console.log( "Sites: ", data);

            
        });
    }
    public  getSitesIdMap(id){
    window.location.href = 'https://securene.co:4200/#/dashboard/'+id;//https://securene.co:
    }

public  InitMap(){


  var data = Highcharts.geojson(Highcharts.maps['countries/pk/pk-all']),
    separators = Highcharts.geojson(Highcharts.maps['countries/pk/pk-all'], 'mapline'),
    // Some responsiveness
    small = $('#googleMap').width() < 400;

  // Set drilldown pointers
  $.each(data, function (i) {
    this.drilldown = this.properties['hc-key'];
    this.value = i; // Non-random bogus data
  });

  // Instantiate the map
  Highcharts.mapChart('googleMap', {
    chart: {
      events: {
        drilldown: function (e) {
        
          if (!e.seriesOptions) {
            var chart = this,
              mapKey = 'countries/pk/' + e.point.drilldown + '-all',

              //this.getSites(cityName);
               cityName = e.point.name;
              //alert(cityName);
              //this.varFunc = cityName;
              //console.log(window.that);
              window.that.getSites(cityName);



            // Show the spinner
            chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); 
            // Load the drilldown map
             //alert(e.point.name);

            
                this.map = new google.maps.Map(document.getElementById('googleMap'), {
                  zoom: 25,
                  center: new google.maps.LatLng(30.76405113, -116.0092603),
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                //console.log(this.map);
                codeAddress(e.point.name, this.map);

                function codeAddress(loc, mapPlot) {
                  var address = loc
                  var geocoder = new google.maps.Geocoder();

                  geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                      mapPlot.setCenter(results[0].geometry.location);
                      //var marker = new google.maps.Marker({
                         // map: mapPlot, 
                              //position: results[0].geometry.location
                        //  });
                      if (results[0].geometry.viewport) 
                        mapPlot.fitBounds(results[0].geometry.viewport);
                    } else {
                      alert("Geocode was not successful for the following reason: " + status);

                    }

                  });
                }

                
                
                 

           
          }

          this.setTitle(null, { text: e.point.name });
        },
        drillup: function () {
          this.setTitle(null, { text: '' });
        }
      }
    },

    title: {
      text: ''
    },

    subtitle: {
      text: '',
      floating: true,
      align: 'right',
      y: 50,
      style: {
        fontSize: '16px'
      }
    },

    legend: small ? {} : {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    colorAxis: {
      min: 0,
      minColor: '#E6E7E8',
      maxColor: '#005645'
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        //verticalAlign: 'bottom'
      }
    },

    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#EEDD66'
          }
        }
      }
    },

    series: [{
      data: data,
      name: 'Pakistan',
      dataLabels: {
        enabled: true,
        format: '{point.properties.name}'
      }
    }, {
      type: 'mapline',
      data: separators,
      color: 'black',
      enableMouseTracking: false,
      animation: {
        duration: 500
      }
    }],

    drilldown: {
      activeDataLabelStyle: {
        color: '#000000',
        textDecoration: 'none',
        //textOutline: '1px #000000'
      },
      drillUpButton: {
        relativeTo: 'spacingBox',
        position: {
          x: 0,
          y: 60
        }
      }
    }

  });

}


  getAssetsAnalyticsss(si) {
    //console.log(si, 'ras');
    alert(si);

    /*this.map = new google.maps.Map(document.getElementById('googleMap'), {
      zoom: 7,
      center: new google.maps.LatLng(30.76405113, -116.0092603),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });*/
    (function () {
    var height = 600;
    var width = 900;
    var projection = d3.geo.mercator();
    var map = void 0;
    var mexico = void 0;
    var hover = function (d) {
      //console.log('d', d, 'event', event);
      var div = document.getElementById('tooltip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';
      div.innerHTML = d.properties.NAME_1;
    };
    var path = d3.geo.path().projection(projection);
    var svg = d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
      d3.json('https://gist.githubusercontent.com/leenoah1/535b386ec5f5abdb2142258af395c388/raw/a045778d28609abc036f95702d6a44045ae7ca99/geo-data.json', function (data) {
      var states = topojson.feature(data, data.objects.MEX_adm1);
      var b, s, t;
      projection.scale(1).translate([0, 0]);
      var b = path.bounds(states);
      var s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
      var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
      projection.scale(s).translate(t);
      map = svg.append('g').attr('class', 'boundary');
      mexico = map.selectAll('path').data(states.features);
      mexico.enter()
        .append('path')
        .attr('d', path)
        .on("mouseover", hover);
      mexico.attr('fill', '#eee');
      mexico.exit().remove();
      });
      

    })();
     //this.getAssets(site);
     //this.getAnalytics(site);
     //this.getStates(site);
     //this.getMapLatLng(site);
    //if (this.intervalss) {
        //   clearInterval(this.intervalss);
      //}
           
    // this.intervalss=setInterval(()=>{
     //    this.getAssets(site);
      ////   this.getAnalytics(site);
      //   this.getStates(site);
      //   this.getMapLatLng(site);
     // }, 30000); 

  }






//Get MapData
getMapLatLng(site){
if(site != this.sited){
  this.counters = 0;
    //console.log(this.plottedArray);
    for(var newinvn in this.plottedArray){
      
      if(newinvn != "diff"){
         var invnn = this.plottedArray[newinvn];
         this.markers[invnn].setMap(null);
         this.markers[invnn] = null;    
         //console.log(this.markers);   

      }
         
      
    }

  this.markers=[];
  this.plottedArray = [];
  this.assetStateRegisteredDiscovered = [];
  this.newArray = [];
}
this.counters = this.counters + 1;
this.sited = site;
//console.log(this.counters);
  let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

      this.http.get(`https://198.199.65.148:9445/analytics/tables/SITES`,options)
     .subscribe((data:  Array<object>) => {
            this.sitesmap = data;
            //console.log(data);

           // Get Assets
             
               let tagIdAsssetInventoryNo = [];
              
              this.http.get(`https://198.199.65.148:9445/analytics/tables/ASSETS3`, options)
               .subscribe((data:  Array<object>) => {
                      //this.assets = data;
                      //console.log(data);

                      for(var data of data){
                        if(data.values.assigned_site_id == site && data.values.exit_date_time == "null"){
                            
                            tagIdAsssetInventoryNo[data.values.asset_inventory_no] = data.values.assigned_tag_id;
                        }
                      }
                      
                  // Get Asset States
                    this.http.get(`https://198.199.65.148:9445/analytics/tables/TAGS_STATES2`, options)
                     .subscribe((data:  Array<object>) => {
                            //this.assets = data;
                            //console.log(data);
                            //console.log(tagIdAsssetInventoryNo);
                        
                      
                      for(var data of data){
                         for(var inv in tagIdAsssetInventoryNo){
                            if(data.values.tag_id == tagIdAsssetInventoryNo[inv] && data.values.state == 'Registered discovered'){

                               if(this.counters == 1){
                                   this.assetStateRegisteredDiscovered.push(inv);
                                   this.plottedArray.push(inv); 
                                   //console.log(this.plottedArray);        

                              }else{
                                 this.counters = 2;
                                 this.newArray.push(inv);
                                 //console.log(this.newArray);

                              }                       
                               
                               
                            }
                        }
                      }
                    
                   // if(this.counters == 1){
                                  
                       // this.plottedArray = ["asset-003","asset-004","asset-005","asset-006"];
                       // this.assetStateRegisteredDiscovered = ["asset-003","asset-004","asset-005","asset-006"];
                           

                   // }else{
                      // this.counters = 2;
                       //this.newArray = ["asset-001","asset-002","asset-003"];
                    //}
                    let LatLngArray = [];
                    for(let sites of this.sitesmap){
                      if(sites.values.site == site){
                        LatLngArray['p1_lat'] = sites.values.p1_lat;
                        LatLngArray['p1_lng'] = sites.values.p1_lng;
                        LatLngArray['p2_lat'] = sites.values.p2_lat;
                        LatLngArray['p2_lng'] = sites.values.p2_lng;               
                      }
                      
                    }
                      
                if(this.counters == 1){
                       
                  //console.log(LatLngArray);
                  
                  function getRandom_marker(bounds) {
                       var lat_min = bounds.getSouthWest().lat(),
                           lat_range = bounds.getNorthEast().lat() - lat_min,
                           lng_min = bounds.getSouthWest().lng(),
                           lng_range = bounds.getNorthEast().lng() - lng_min;

                       return new google.maps.LatLng(lat_min + (Math.random() * lat_range), 
                                                     lng_min + (Math.random() * lng_range));
                     }
           
                   var rectangle = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: this.map,
                    bounds: {
                      north: LatLngArray['p1_lat'],
                      south: LatLngArray['p2_lat'],
                      east:  LatLngArray['p1_lng'],
                      west:  LatLngArray['p2_lng']
                    }
                  });
                   
                     this.recBounds = rectangle.getBounds();
                     var cent = this.recBounds.getCenter();
                     this.map.setCenter(cent);
                     this.icon = {
                                    url: "assets/images/tag.png", // url
                                    scaledSize: new google.maps.Size(25, 35), // scaled size
                                    labelOrigin: new google.maps.Point(25,0)
                                };

                    
                      
                      for (var i = 0; i < this.assetStateRegisteredDiscovered.length; i++) {
                      var invN = this.assetStateRegisteredDiscovered[i];
                       this.markers[invN] = new google.maps.Marker({
                         position: getRandom_marker(this.recBounds), 
                         map: this.map,
                         icon:this.icon,
                         label: {text: this.assetStateRegisteredDiscovered[i], color: "#03376F",fontWeight: "bold"},
                         title: this.assetStateRegisteredDiscovered[i]
                       });  

                     }
                    
                    }

                    if(this.counters != 1){
                      // check weather plottedArray and  newArray are equal or not
                      //var is_same = this.plottedArray.length == this.newArray.length && this.plottedArray.every(function(element, index) {
                       //   return element === this.newArray[index]; 
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
           
                   

                    Array.prototype.diff = function(a) {
                        return this.filter(function(i) {return a.indexOf(i) < 0;});
                    };
                    
                    
                    //console.log(this.newArray);
                    //console.log(this.plottedArray);
                      var dif1 = this.newArray.diff(this.plottedArray);

                      //console.log("add these markers: "+ dif1);
                      for(i=0; i<dif1.length; i++){
                        //console.log(dif1[i]);
                        var invN = dif1[i];
                         this.markers[invN] = new google.maps.Marker({
                           position: getRandom_marker(this.recBounds), 
                           map: this.map,
                           icon:this.icon,
                           label: {text: dif1[i], color: "#03376F",fontWeight: "bold"},
                           title: dif1[i]
                         });   
                      
                      }
                      var dif2 = this.plottedArray.diff(this.newArray); 
                      
                      //console.log("remove these markers: "+dif2);
                      for(i=0; i<dif2.length; i++){
                        //console.log(dif2[i]);
                        var invN = dif2[i];
                        this.markers[invN].setMap(null);
                        this.markers[invN] = null;
                      }

                      this.plottedArray=this.newArray;
                      this.assetStateRegisteredDiscovered = this.newArray;
                      this.newArray = [];
                    
                    //}
                        
                    //console.log(markers);
                   //markers[invN].setMap(null);
                    //markers[2]=null;
                }   
                
              
                // the drop down select sites is refresh after this site api call here   
                            
            });
         });
          
  
}

            
       
}   


getAssetInfo(asset){

    let httpHeaders = new HttpHeaders({
               'Content-Type':'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               'headers': httpHeaders
           };   

    // Get Assets   

    
    this.http.get(`https://198.199.65.148:9445/analytics/tables/ASSETS3`, options)
     .subscribe((data:  Array<object>) => {
           
            for(var info of data){
              if(info.values.asset_inventory_no == asset){
                this.assetInfo = info;
              }
            }
           
            
    }); 
    
}
public  getAlerts(){
     this.alertsCounters = this.alertsCounters+1;  
       
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });
        let options = {
         headers: httpHeaders
         }; 
     
         this.http.get(`https://198.199.65.148:9445/analytics/tables/ASSETS3`, options)
               .subscribe((data:  Array<object>) => {
                      this.AlertsAssets = data;
                      this.http.get(`https://198.199.65.148:9445/analytics/tables/TAGS_ALERT_EVENTS5`,options)
                      .subscribe((data:  Array<object>) => {
                              if(this.alertsCounters == 1){
                                this.alerts = data;
                                          
                               //console.log(dateString);  
                                if(this.alerts.length > 100){
                                   var PreviousHundredAlertTime = this.alerts[this.alerts.length-101].timestamp;
                                }else{
                                  var PreviousHundredAlertTime = this.alerts[0].timestamp;
                                }
                               this.LastAlertTime = this.alerts[this.alerts.length-1].timestamp+1;
                               //console.log(LastAlertTime);
                                    this.http.get(`https://198.199.65.148:9445/analytics/tables/TAGS_ALERT_EVENTS5/`+PreviousHundredAlertTime+`/`+this.LastAlertTime,options)
                                   .subscribe((data:  Array<object>) => {

                                          this.alertss=data;  
                                          //console.log(this.alertss); 
                                          for(let alertss of this.alertss){
                                          for(let assetsss of this.AlertsAssets){
                                          if(alertss.values.tag_id==assetsss.values.assigned_tag_id  && assetsss.values.exit_date_time == "null"){
                                               
                                             this.assetAndAlertobj.unshift({assetInv:assetsss.values.asset_inventory_no, state:alertss.values.event, last_id:alertss.values.last_alert_id});
                                            }
                                          }
                                        }
                                       //console.log(this.assetAndAlertobj);
                                       //this.ass=this.assetAndAlertobj.length;    
                                      });

                                
                              }
                                
                              if(this.alertsCounters != 1){ 
                                       
                                  var currentDate = this.date = new Date();
                                         var date = currentDate.getDate();
                                         var month = currentDate.getMonth(); //Be careful! January is 0 not 1
                                         var year = currentDate.getFullYear();
                                         var hours = currentDate.getHours();
                                         // Minutes part from the timestamp
                                         var minutes = currentDate.getMinutes();
                                         // Seconds part from the timestamp
                                         var seconds = currentDate.getSeconds();
                                         // Will display time in 10:30:23 format
                                         var formattedTime = hours + ':' + minutes + ':' + seconds;
                                         var dateString = year + "." +(month + 1) + "." + date+" "+formattedTime;
                                         var dateString = new Date(dateString).getTime();
                                         
                                         //console.log(dateString);
                                         
                                            if(this.alertss.length != 0 && this.alertsCounters > 2){
                                             this.LastAlertTime = this.alertss[this.alertss.length-1].timestamp;
                                            }
                                         
                                         
                                         //console.log(LastAlertTime);
                             
                                
                                    this.http.get(`https://198.199.65.148:9445/analytics/tables/TAGS_ALERT_EVENTS5/`+this.LastAlertTime+`/`+dateString,options)
                                   .subscribe((data:  Array<object>) => {

                                          this.alertss=data;  
                                          //console.log(this.alertss); 
                                          for(let alertss of this.alertss){
                                          for(let assetsss of this.AlertsAssets){
                                          if(alertss.values.tag_id==assetsss.values.assigned_tag_id  && assetsss.values.exit_date_time == "null"){
                                             if(alertss.values.event == 'Tempering Detected'){
                                                 $('#AseetInv').html(assetsss.values.asset_inventory_no+":");
                                                 $(".Top-Right-Alert").slideDown('slow');
                                                  setTimeout(function(){
                                                    $(".Top-Right-Alert").slideUp('slow');
                                                  },5000);
                                              }
                                             this.assetAndAlertobj.unshift({assetInv:assetsss.values.asset_inventory_no, state:alertss.values.event, last_id:alertss.values.last_alert_id});
                                            }
                                          }
                                        }
                                        
                                      //console.log(this.assetAndAlertobj);  
                                      //this.ass=this.assetAndAlertobj.length;      
                                      });
                                    
                                  this.alertsCounters = 3;
                                }
                                  
                            });
                    
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
