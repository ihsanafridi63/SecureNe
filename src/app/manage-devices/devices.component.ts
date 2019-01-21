import { Component, OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router";

//form
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NgForm } from '@angular/forms';

@Component ({
    templateUrl: 'devices.html'
})

export class DevicesComponent implements OnInit {
    constructor(private svc: ApiService, private http: HttpClient, private router: Router){
   //this.svc.printToConsole('Got the Service'); 
  }
    dtOptions: DataTables.Settings = {};
    public devices:Array<object> = [];
    public devicesed:Array<object> = [];
    public deviceRegMess = "";
    public vldDeviceIdMess="";
    public vldSiteNameMess="";
    public vldTopRightLatMess="";
    public vldTopRightLngMess="";
    public vldBottomLeftLatMess="";
    public vldBottomLeftLngMess="";
    public vldCityMess="";
    public vldRegionMess="";

    public deviceUpRegMess = "";
    public vldUpDeviceIdMess="";
    public vldUpSiteNameMess="";
    public vldUpTopRightLatMess="";
    public vldUpTopRightLngMess="";
    public vldUpBottomLeftLatMess="";
    public vldUpBottomLeftLngMess="";
    public vldUpCityMess="";
    public vldUpRegionMess="";

    public delDevice=""
     
    ngOnInit(): void {
        
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

        this.getDevices(); 
    }    
    
    
getDevices(){
       
      let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {
            this.devicesed = [];
            this.devices = data; 
            //console.log(this.devices);

            for (let device of this.devices) {
             this.devicesed.push({site_id: device.values.site_id, site_name: device.values.site_name, top_right_lat:device.values.top_right_lat, top_right_lng:device.values.top_right_lng, bottom_left_lat:device.values.bottom_left_lat, bottom_left_lng:device.values.bottom_left_lng, city:device.values.city, region:device.values.region});
            }
               
              //console.log(this.devicesed)
              setTimeout(function(){
                $("#devicesTable tbody").show();
                $('#devices-spinner').hide();
                $('#devicesTable').DataTable();
              },2000);
                  
            
        });

}


// register Device
regDevice(){

     //console.log(this.DeviceId);
     //console.log(this.SiteName);
     //console.log(this.TopRightLat);
     //console.log(this.TopRightLng);
     //console.log(this.BottomLeftLat);
     //console.log(this.BottomLeftLng);
     //console.log(this.City);
     //console.log(this.Region);
     if(this.DeviceId == undefined || this.DeviceId == ""){
        this.vldDeviceIdMess="Device Id is required!";
        return false;
     }else{
       this.vldDeviceIdMess="";
     }
     if(this.SiteName == undefined || this.SiteName == ""){
        this.vldSiteNameMess="Site Name is required!";
        return false;
     }else{
       this.vldSiteNameMess="";
     }
     if(this.TopRightLat == undefined || this.TopRightLat == ""){
        this.vldTopRightLatMess="Top Right Lat is required!";
        return false;
     }else{
       this.vldTopRightLatMess="";
     }
     if(this.TopRightLng == undefined || this.TopRightLng == ""){
        this.vldTopRightLngMess="Top Right Lng is required!";
        return false;
     }else{
       this.vldTopRightLngMess="";
     }
     
     if(this.BottomLeftLat == undefined || this.BottomLeftLat == ""){
        this.vldBottomLeftLatMess="Bottom Left Lat is required!";
        return false;
     }else{
       this.vldBottomLeftLatMess="";
     }
     if(this.BottomLeftLng == undefined || this.BottomLeftLng == ""){
        this.vldBottomLeftLngMess="Bottom Left Lng is required!";
        return false;
     }else{
       this.vldBottomLeftLngMess="";
     }
     if(this.City == undefined || this.City == ""){
        this.vldCityMess="City is required!";
        return false;
     }else{
       this.vldCityMess="";
     }
     if(this.Region == undefined || this.Region == ""){
        this.vldRegionMess="Region is required!";
        return false;
     }else{
       this.vldRegionMess="";
     }


    $('#btnDeviceDisable').attr('disabled', true);
    let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
            });

    let options = {
     headers: httpHeaders
     }; 


  let bodyy = {"event" :  {"payloadData": {"site_id":this.DeviceId, "site_name":this.SiteName, "top_right_lat":this.TopRightLat, "top_right_lng":this.TopRightLng, "bottom_left_lat":this.BottomLeftLat, "bottom_left_lng": this.BottomLeftLng, "city": this.City, "region": this.Region}}};

    this.http.post(`https://securene.co:9445/endpoints/site_data`,bodyy, options)
     .subscribe((data:  Array<object>) => {
            //console.log(data);
            if(data == null){
             this.deviceRegMess="Device Successfully Registered";
             $("#deviceRegMess").fadeIn('slow');
             setTimeout(function(){
                $("#deviceRegMess").fadeOut(1000);
             }, 5000);

             $('#btnDeviceDisable').attr('disabled', false);
            }
            
         
        }); 

}

// get Device to be update
getDeviceIdToBeUpdate(UpDeviceId){
    //console.log(this.devicesed);
    for(let device of this.devicesed){
      if(device.site_id == UpDeviceId){
         this.UpDeviceId = device.site_id;
         this.UpSiteName = device.site_name;
         this.UpTopRightLat = device.top_right_lat;
         this.UpTopRightLng = device.top_right_lng;
         this.UpBottomLeftLat = device.bottom_left_lat;
         this.UpBottomLeftLng = device.bottom_left_lng;
         this.UpCity = device.city;
         this.UpRegion = device.region;
      }
    }
}

// Update Device
updateDevice(){
     //console.log(this.UpDeviceId);
     //console.log(this.UpSiteName);
     //console.log(this.UpTopRightLat);
     //console.log(this.UpTopRightLng);
     //console.log(this.UpBottomLeftLat);
     //console.log(this.UpBottomLeftLng);
     //console.log(this.UpCity);
     //console.log(this.UpRegion);
     if(this.UpDeviceId == undefined || this.UpDeviceId == ""){
        this.vldUpDeviceIdMess="Device Id is required!";
        return false;
     }else{
       this.vldUpDeviceIdMess="";
     }
     if(this.UpSiteName == undefined || this.UpSiteName == ""){
        this.vldUpSiteNameMess="Site Name is required!";
        return false;
     }else{
       this.vldUpSiteNameMess="";
     }
     if(this.UpTopRightLat == undefined || this.UpTopRightLat == ""){
        this.vldUpTopRightLatMess="Top Right Lat is required!";
        return false;
     }else{
       this.vldUpTopRightLatMess="";
     }
     if(this.UpTopRightLng == undefined || this.UpTopRightLng == ""){
        this.vldUpTopRightLngMess="Top Right Lng is required!";
        return false;
     }else{
       this.vldUpTopRightLngMess="";
     }
     
     if(this.UpBottomLeftLat == undefined || this.UpBottomLeftLat == ""){
        this.vldUpBottomLeftLatMess="Bottom Left Lat is required!";
        return false;
     }else{
       this.vldUpBottomLeftLatMess="";
     }
     if(this.UpBottomLeftLng == undefined || this.UpBottomLeftLng == ""){
        this.vldUpBottomLeftLngMess="Bottom Left Lng is required!";
        return false;
     }else{
       this.vldUpBottomLeftLngMess="";
     }
     if(this.UpCity == undefined || this.UpCity == ""){
        this.vldUpCityMess="City is required!";
        return false;
     }else{
       this.vldUpCityMess="";
     }
     if(this.UpRegion == undefined || this.UpRegion == ""){
        this.vldUpRegionMess="Region is required!";
        return false;
     }else{
       this.vldUpRegionMess="";
     }


    $('#btnUpDeviceDisable').attr('disabled', true);
    let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
            });

    let options = {
     headers: httpHeaders
     }; 


  let bodyy = {"event" :  {"payloadData": {"site_id":this.UpDeviceId, "site_name":this.UpSiteName, "top_right_lat":this.UpTopRightLat, "top_right_lng":this.UpTopRightLng, "bottom_left_lat":this.UpBottomLeftLat, "bottom_left_lng": this.UpBottomLeftLng, "city": this.UpCity, "region": this.UpRegion}}};

    this.http.post(`https://securene.co:9445/endpoints/site_data`,bodyy, options)
     .subscribe((data:  Array<object>) => {
            //console.log(data);
            if(data == null){
             this.deviceUpRegMess="Device Successfully Updated";
             $("#deviceUpRegMess").fadeIn('slow');
             setTimeout(function(){
                $("#deviceUpRegMess").fadeOut(1000);
             }, 5000);

             $('#btnUpDeviceDisable').attr('disabled', false);
            }
            
         
        });  
  
}

// delete Device Id
deleteModalDeviceId(deviceId){  
  this.DelDeviceId=deviceId; 
  this.delDevice=event.target;
  $('#deleteDeviceModal .modal-body').html('Are You Sure You Want To Delete The Device!');
}

// delete Device
deleteDevice(){
  //alert(this.DelDeviceId);
  
  $('#deleteDevice').attr('disabled', true);
          let httpHeaders = new HttpHeaders({
               'Content-Type' : 'application/json',
               'Authorization':'Basic YWRtaW46YWRtaW4='
           });

           let options = {
               headers: httpHeaders
           }; 

           //console.log(this.devicesed);
            for(let device of this.devicesed){
              if(device.site_id == this.DelDeviceId){
                 var site_id = device.site_id;
                 var site_name= device.site_name;
                 var top_right_lat= device.top_right_lat;
                 var top_right_lng = device.top_right_lng;
                 var bottom_left_lat= device.bottom_left_lat;
                 var bottom_left_lng = device.bottom_left_lng;
                 var city = device.city;
                 var region = device.region;
            
                 var exitDate = new Date();
                 var date = exitDate.getDate();
                 var month = exitDate.getMonth(); //Be careful! January is 0 not 1
                 var year = exitDate.getFullYear();
                 var hours = exitDate.getHours();
                 var minutes = exitDate.getMinutes();
                 var seconds = exitDate.getSeconds();
                 var formattedTime = hours + ':' + minutes + ':' + seconds;
                 var dateString = year + "-" +(month + 1) + "-" + date+" "+formattedTime;
                 var exit_date_time= dateString;

                 let bodyy = {"event" :  {"payloadData": {"site_id":site_id, "site_name":site_name,"top_right_lat":top_right_lat,"top_right_lng":top_right_lng, "bottom_left_lat":bottom_left_lat, "bottom_left_lng": bottom_left_lng, "city": city, "region": region, "exit_date_time": exit_date_time}}};
                 //console.log(bodyy);

                 this.http.post(`https://securene.co:9445/endpoints/site_data`,bodyy, options)
                 .subscribe((data:  Array<object>) => {
                        //console.log(data);
                        if(data == null){
                           $(this.delDevice).closest('tr').remove();
                           $('#deleteDeviceModal .modal-body').html('<h5>Successfully Deleted.</h5>');
                          $('#deleteDevice').attr('disabled', false); 
                        }
                        
                     
                    });


              }
            }
            
  
}


}