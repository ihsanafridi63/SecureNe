import { Component, AfterViewChecked, OnInit, ElementRef ,ViewChild } from '@angular/core';
import { ThemeConstants } from '../shared/config/theme-constant';
//import 'ammap3';
//import 'ammap3/ammap/maps/js/usaLow';
import Chart from 'chart.js';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import 'src/assets/js/jquery.sparkline/jquery.sparkline.js';
import * as $ from 'jquery';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import * as XLSX from 'xlsx';
//import { fromPromise } from 'rxjs';
//import { interval } from 'rxjs';
//import { fromEvent } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';


@Component({
  templateUrl: 'dashboard.html',
  styleUrls: ['../../assets/scss/plugins/_datepicker.scss']
})

export class DashboardComponent implements OnInit{

   // public isCompleted: any;
    public onStep2Next: any;
    public onStep3Next: any;
    public onComplete: any;
    public counters = 0;
    public lat: number;
    public lng: number;
    public lugName: any;
    public tagIdd: any;

public siteIdFXlsx = " ";


  public captureScreen() {
    var element = document.getElementById("spinner");
    element.classList.add("fa-spinner");
        var data = document.getElementById('pdf');
        //var data = document.getElementById('columnchart_values');
        html2canvas(data).then(canvas => {
          // Few necessary setting options  
          var imgWidth = 208;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;

          const contentDataURL = canvas.toDataURL('image/png')
          let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          var element = document.getElementById("spinner");
          element.classList.remove("fa-spinner");
          pdf.save('Reports.pdf'); // Generated PDF  
        });
     
      } 

      @ViewChild('table') table: ElementRef;
      public fireEvent() {
        //var element = document.getElementById("spinner");
        //element.classList.add("fa-spinner");
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     
        /* save to file */
        XLSX.writeFile(wb, 'Reports.xlsx');


      } 

    constructor(private svc: ApiService, private http: HttpClient, private colorConfig:ThemeConstants){
 
    }

    private  lugInfo:  Array<object> = [];
    private  alerts:  Array<object> = [];
    private  mapData: Array<object> =[];
    private assets: Array<object> = [];
    private alerted: Array<object> = []; 
    private Talerted: Array<object> = []; 
    private alertsAll: Array<object> = []; 
    private alertsSL: Array<object> = []; 


        private batteryAlerts: Array<object> = []; 

    private tSites: Array<object> = []; 
     private sitesNameId: Array<object> = [];  



  ngOnInit() {

  this.rLevel = "network";
 
   let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    
    
    this.http.get(`https://securene.co:9445/analytics/tables/site_data_stream`,options)
     .subscribe((data:  Array<object>) => {


                      
                     
                         this.tSites = data;
                         //console.log(this.tSites);
                      
            
        });
    
        //this.dailyReports();
        //this.weeklyReports();
     // this.monthlyReports();
     // this.alertsReports();
      //console.log(nname);
      var B1 = 0;
      var B2 = 0;
      var B3 = 0;
      var B4 = 0;
      var B5 = 0;
      var B6 = 0;
      var B7 = 0;
      var B8 = 0;
      var B9 = 0;
      this.barChart(B3, B4, B5, B6, B7, B8, B9, B1, B2);

    var alertsMessage = "";
    this.alertsMessage = "No Alerts Found!";
    }
  network(){
    $('#reportSites').css('visibility','hidden');
  }
  siteing(){
    $('#reportSites').css('visibility','visible');
  }
  
  public searchReports() {

      var element = document.getElementById("spinner");
    element.classList.add("fa-spinner");
    var mode = this.rMode;
    var date = this.ddate;
   var level = this.rLevel;
   

      if(level == "network"){
      this.siteIdFXlsx =  " ";
        if (mode == 'daily') {
          this.dailyReports(date, " ", " ");
        }
        if (mode == 'weekly') {
              this.weeklyReports(date, " ", " ");
            }
         if (mode == 'monthly') {
          this.monthlyReports(date, " ", " ");
        }
      }
      if(level == "site"){
       var siteId = this.tSite;
   
    this.sitesNameId = [];

          for (let sites of this.tSites) {
           if(sites.values.site_id == siteId){
             this.sitesNameId.unshift({site_id: sites.values.site_id, site_name: sites.values.site_name }); 
            }   
          }
         this.siteIdFXlsx =  this.sitesNameId[0].site_name;
         if (mode == 'daily') {

            this.dailyReports(date, this.sitesNameId[0].site_name, this.sitesNameId[0].site_id);
        }
        if (mode == 'weekly') {
                this.weeklyReports(date, this.sitesNameId[0].site_name, this.sitesNameId[0].site_id);
            }
        if (mode == 'monthly') {
          this.monthlyReports(date, this.sitesNameId[0].site_name, this.sitesNameId[0].site_id);
        }
      }
  }
 public dailyReports(dTime, siteName,  siteId ) {
   
    //var sss = this.sit;
    //console.log(siteId); 
    //console.log(siteName); 
   var date = new Date(dTime);

    var start = new Date(dTime);
    start.setHours(0, 0, 0, 0);
    var dateN = start.getTime());

    var end = new Date(dTime);
    end.setHours(23, 59, 59, 999);
    var dateN2 = end.getTime());


    //console.log(dateN, dateN2);
    //console.log(start, end);

    var dateAnaS = dateN + 86400000;
    var dateAnaE = dateN2 + 86400000;



    //var d = new Date('09/14/2018');
    //console.log(dateN);
    //console.log(dateN2);
    //console.log(new Date(data[0].timestamp));


        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get("https://securene.co:9445/analytics/tables/ANALYTICS_PER_DAY/" + dateAnaS + '/' + dateAnaE, options)
      .subscribe((data: Array<object>) => {
        this.sites = data;

       var missCount = 0;
       var checkCount = 0;
       var transferCount = 0;
       var transitCount = 0;
       var offCount = 0;
       var claimCount = 0;
       var outCount = 0;
        var message = "";
        if (data.length <= 0) {
          this.message = 'No Record Found!';
        }
        else {
          this.message = '';
        }
        //console.log(data);
       if(siteId == " "){
       //console.log(data);

           for(var i = 0; i<data.length;i++){
           if ((data[i].values.site_id != 'null') && (data[i].values.site_id != 'NULL')) {

             if(data[i].values.state == 'Check-in Missing' || data[i].values.state == 'Transfer Loading Missing' || data[i].values.state == 'In-Transit Missing' || data[i].values.state == 'Off-loading Missing' || data[i].values.state == 'Baggage Claim Missing')
               missCount = missCount + data[i].values.count;

             if(data[i].values.state == 'Check-in')
             checkCount = checkCount + data[i].values.count;

             if(data[i].values.state == 'Transfer Loading')
             transferCount = transferCount + data[i].values.count;

             if(data[i].values.state == 'In-Transit')
             transitCount = transitCount + data[i].values.count;

             if(data[i].values.state == 'Off-loading')
             offCount = offCount + data[i].values.count;

             if(data[i].values.state == 'Baggage Claim')
             claimCount = claimCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

             if(data[i].values.state == 'Check-out')
             outCount = outCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

          }

        }
        }
        else{

           for(var i = 0; i<data.length;i++){
          // console.log(data);
           //console.log(data[i].values.site_name, siteId , "today");
           //console.log(siteName);

         if ((data[i].values.site_id != 'null') && (data[i].values.site_id != 'NULL') && (data[i].values.site_id == siteId)) {

             if(data[i].values.state == 'Check-in Missing' || data[i].values.state == 'Transfer Loading Missing' || data[i].values.state == 'In-Transit Missing' || data[i].values.state == 'Off-loading Missing' || data[i].values.state == 'Baggage Claim Missing')
               missCount = missCount + data[i].values.count;

             if(data[i].values.state == 'Check-in')
             checkCount = checkCount + data[i].values.count;

             if(data[i].values.state == 'Transfer Loading')
             transferCount = transferCount + data[i].values.count;

             if(data[i].values.state == 'In-Transit')
             transitCount = transitCount + data[i].values.count;

             if(data[i].values.state == 'Off-loading')
             offCount = offCount + data[i].values.count;

             if(data[i].values.state == 'Baggage Claim')
             claimCount = claimCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

             if(data[i].values.state == 'Check-out')
             outCount = outCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

        }

        }
      
       }
        var Total = checkCount + transferCount + transitCount + offCount + claimCount + outCount+ missCount;
      //console.log(Missing, Total );
      var missPercent = 0;
      var checkPercent = 0;
      var transferPercent = 0;
      var transitPercent = 0;
      var offPercent = 0;
      var claimPercent = 0;
      var outPercent = 0;

      if(Total != 0){
          this.missPercent = Math.round(missCount/Total * 100);
          this.checkPercent = Math.round(checkCount/Total * 100);
          this.transferPercent = Math.round(transferCount/Total * 100);
          this.transitPercent = Math.round(transitCount/Total * 100);
          this.offPercent = Math.round(offCount/Total * 100);
          this.claimPercent = Math.round(claimCount/Total * 100);
          this.outPercent = Math.round(outCount/Total * 100);
          //console.log(this.pendingInstallationPer,'%' );
      }
      else{
          this.missPercent = 0;
          this.checkPercent = 0;
          this.transferPercent = 0;
          this.transitPercent = 0;
          this.offPercent = 0;
          this.claimPercent = 0;
          this.outPercent = 0;

          this.message = 'No Record Found!';
      }
        this.donutChartData = [checkCount, transferCount, transitCount, offCount, claimCount, outCount, missCount];

        this.alertsReports(dateN, dateN2, siteName);

                
      });
    
   
    }


  public weeklyReports(dTime, siteName,  siteId) {
   var date = new Date(dTime);
        //var d = new Date();

    //var start = new Date(dTime);
    //start.setHours(0, 0, 0, 0);
    //var dateN = start.getTime());

    var num = date.getDay();
    //console.log(num);

    //var date = new Date(dTime);

    var monthIndex = date.getMonth();
        date.setHours(0, 0, 0, 0);

        var year = date.getFullYear();
     if (num == 1) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 7;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe;
          var dateAlertE = dateAlertS + 86400000 * 7;
        }
        if (num == 2) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 6;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe - 86400000;
          var dateAlertE = dateAlertS + 86400000 * 7;
        }
        if (num == 3) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 5;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe - 86400000 * 2;
          var dateAlertE = dateAlertS + 86400000 * 7;
        }
        if (num == 4) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 4;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe - 86400000 * 3;
          var dateAlertE = dateAlertS + 86400000 * 7;

        }
        if (num == 5) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 3;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe - 86400000 * 4;
          var dateAlertE = dateAlertS + 86400000 * 7;
        }
        if (num == 6) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 2;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe - 86400000 * 5;
          var dateAlertE = dateAlertS + 86400000 * 7;
        }
        if (num == 0) {
          var fe = date.getTime();
          var dateN = fe + 86400000 * 1;
          var dateN2 = dateN + 86400000 * 6;

          var dateAlertS = fe - 86400000 * 6;
          var dateAlertE = dateAlertS + 86400000 * 7;
        }
    
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/ANALYTICS_PER_WEEK/` + dateN + '/' + dateN2, options)
     .subscribe((data:  Array<object>) => {
            this.sites = data;
       //console.log(data);

       //console.log(new Date('09/14/2018'));
       //console.log(new Date(data[0].timestamp));
       var missCount = 0;
       var checkCount = 0;
       var transferCount = 0;
       var transitCount = 0;
       var offCount = 0;
       var claimCount = 0;
       var outCount = 0;
        var message = "";
        if (data.length <= 0) {
          this.message = 'No Record Found!';
        }
        else {
          this.message = '';
        }
        //console.log(data);
       if(siteId == " "){
       //console.log(data);

           for(var i = 0; i<data.length;i++){
           if ((data[i].values.site_id != 'null') && (data[i].values.site_id != 'NULL')) {

             if(data[i].values.state == 'Check-in Missing' || data[i].values.state == 'Transfer Loading Missing' || data[i].values.state == 'In-Transit Missing' || data[i].values.state == 'Off-loading Missing' || data[i].values.state == 'Baggage Claim Missing')
               missCount = missCount + data[i].values.count;

             if(data[i].values.state == 'Check-in')
             checkCount = checkCount + data[i].values.count;

             if(data[i].values.state == 'Transfer Loading')
             transferCount = transferCount + data[i].values.count;

             if(data[i].values.state == 'In-Transit')
             transitCount = transitCount + data[i].values.count;

             if(data[i].values.state == 'Off-loading')
             offCount = offCount + data[i].values.count;

             if(data[i].values.state == 'Baggage Claim')
             claimCount = claimCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

             if(data[i].values.state == 'Check-out')
             outCount = outCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

          }

        }
        }
        else{

           for(var i = 0; i<data.length;i++){
          // console.log(data);
           //console.log(data[i].values.site_name, siteId , "today");
           //console.log(siteName);

         if ((data[i].values.site_id != 'null') && (data[i].values.site_id != 'NULL') && (data[i].values.site_id == siteId)) {

             if(data[i].values.state == 'Check-in Missing' || data[i].values.state == 'Transfer Loading Missing' || data[i].values.state == 'In-Transit Missing' || data[i].values.state == 'Off-loading Missing' || data[i].values.state == 'Baggage Claim Missing')
               missCount = missCount + data[i].values.count;

             if(data[i].values.state == 'Check-in')
             checkCount = checkCount + data[i].values.count;

             if(data[i].values.state == 'Transfer Loading')
             transferCount = transferCount + data[i].values.count;

             if(data[i].values.state == 'In-Transit')
             transitCount = transitCount + data[i].values.count;

             if(data[i].values.state == 'Off-loading')
             offCount = offCount + data[i].values.count;

             if(data[i].values.state == 'Baggage Claim')
             claimCount = claimCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

             if(data[i].values.state == 'Check-out')
             outCount = outCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

        }

        }
      
       }
        var Total = checkCount + transferCount + transitCount + offCount + claimCount + outCount+ missCount;
      //console.log(Missing, Total );
      var missPercent = 0;
      var checkPercent = 0;
      var transferPercent = 0;
      var transitPercent = 0;
      var offPercent = 0;
      var claimPercent = 0;
      var outPercent = 0;

      if(Total != 0){
          this.missPercent = Math.round(missCount/Total * 100);
          this.checkPercent = Math.round(checkCount/Total * 100);
          this.transferPercent = Math.round(transferCount/Total * 100);
          this.transitPercent = Math.round(transitCount/Total * 100);
          this.offPercent = Math.round(offCount/Total * 100);
          this.claimPercent = Math.round(claimCount/Total * 100);
          this.outPercent = Math.round(outCount/Total * 100);
          //console.log(this.pendingInstallationPer,'%' );
      }
      else{
          this.missPercent = 0;
          this.checkPercent = 0;
          this.transferPercent = 0;
          this.transitPercent = 0;
          this.offPercent = 0;
          this.claimPercent = 0;
          this.outPercent = 0;

          this.message = 'No Record Found!';
      }
        this.donutChartData = [checkCount, transferCount, transitCount, offCount, claimCount, outCount, missCount];
       this.alertsReports(dateAlertS, dateAlertE, siteName);
        //var element = document.getElementById("spinner");
        //element.classList.remove("fa-spinner");
                
        });
   
    }

  public monthlyReports(dTime, siteName, siteId) {
    //console.log(dTime);//2018-10-22
    var date = new Date(dTime);

    var dateAnalyticsS = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var dateAnalyticsE = new Date(date.getFullYear(), date.getMonth() + 2, 0);

    var dateAlertsS = new Date(date.getFullYear(), date.getMonth(), 1);
    var dateAlertsE = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    //console.log(dateAnalyticsS, dateAnalyticsE);
    //console.log(dateAlertsS, dateAlertsE);
    var dateStartAnalytics = dateAnalyticsS.getTime();
    var dateEndAnalytics = dateAnalyticsE.getTime();

    var dateStartAlerts = dateAlertsS.getTime() ;
    var dateEndAlerts = dateAlertsE.getTime();

    
        let httpHeaders = new HttpHeaders({
           'Content-Type' : 'application/json',
           'Authorization':'Basic YWRtaW46YWRtaW4='
       });

        let options = {
         headers: httpHeaders
         }; 
    

    this.http.get(`https://securene.co:9445/analytics/tables/ANALYTICS_PER_MONTH/` + dateStartAnalytics + '/' + dateEndAnalytics, options)
     .subscribe((data:  Array<object>) => {
            this.sites = data;
       //console.log(data);

       //console.log(new Date('09/14/2018'));
       //console.log(new Date(data[0].timestamp));
       var missCount = 0;
       var checkCount = 0;
       var transferCount = 0;
       var transitCount = 0;
       var offCount = 0;
       var claimCount = 0;
       var outCount = 0;
        var message = "";
        if (data.length <= 0) {
          this.message = 'No Record Found!';
        }
        else {
          this.message = '';
        }
        //console.log(data);
       if(siteId == " "){
       //console.log(data);

           for(var i = 0; i<data.length;i++){
           if ((data[i].values.site_id != 'null') && (data[i].values.site_id != 'NULL')) {

             if(data[i].values.state == 'Check-in Missing' || data[i].values.state == 'Transfer Loading Missing' || data[i].values.state == 'In-Transit Missing' || data[i].values.state == 'Off-loading Missing' || data[i].values.state == 'Baggage Claim Missing')
               missCount = missCount + data[i].values.count;

             if(data[i].values.state == 'Check-in')
             checkCount = checkCount + data[i].values.count;

             if(data[i].values.state == 'Transfer Loading')
             transferCount = transferCount + data[i].values.count;

             if(data[i].values.state == 'In-Transit')
             transitCount = transitCount + data[i].values.count;

             if(data[i].values.state == 'Off-loading')
             offCount = offCount + data[i].values.count;

             if(data[i].values.state == 'Baggage Claim')
             claimCount = claimCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

             if(data[i].values.state == 'Check-out')
             outCount = outCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

          }

        }
        }
        else{

           for(var i = 0; i<data.length;i++){
          // console.log(data);
           //console.log(data[i].values.site_name, siteId , "today");
           //console.log(siteName);

         if ((data[i].values.site_id != 'null') && (data[i].values.site_id != 'NULL') && (data[i].values.site_id == siteId)) {

             if(data[i].values.state == 'Check-in Missing' || data[i].values.state == 'Transfer Loading Missing' || data[i].values.state == 'In-Transit Missing' || data[i].values.state == 'Off-loading Missing' || data[i].values.state == 'Baggage Claim Missing')
               missCount = missCount + data[i].values.count;

             if(data[i].values.state == 'Check-in')
             checkCount = checkCount + data[i].values.count;

             if(data[i].values.state == 'Transfer Loading')
             transferCount = transferCount + data[i].values.count;

             if(data[i].values.state == 'In-Transit')
             transitCount = transitCount + data[i].values.count;

             if(data[i].values.state == 'Off-loading')
             offCount = offCount + data[i].values.count;

             if(data[i].values.state == 'Baggage Claim')
             claimCount = claimCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

             if(data[i].values.state == 'Check-out')
             outCount = outCount + data[i].values.count;
             //data[i].values.state == 'In Transit' ? Intransit = Intransit + 1 : Intransit = 1;

        }

        }
      
       }
        var Total = checkCount + transferCount + transitCount + offCount + claimCount + outCount+ missCount;
      //console.log(Missing, Total );
      var missPercent = 0;
      var checkPercent = 0;
      var transferPercent = 0;
      var transitPercent = 0;
      var offPercent = 0;
      var claimPercent = 0;
      var outPercent = 0;

      if(Total != 0){
          this.missPercent = Math.round(missCount/Total * 100);
          this.checkPercent = Math.round(checkCount/Total * 100);
          this.transferPercent = Math.round(transferCount/Total * 100);
          this.transitPercent = Math.round(transitCount/Total * 100);
          this.offPercent = Math.round(offCount/Total * 100);
          this.claimPercent = Math.round(claimCount/Total * 100);
          this.outPercent = Math.round(outCount/Total * 100);
          //console.log(this.pendingInstallationPer,'%' );
      }
      else{
          this.missPercent = 0;
          this.checkPercent = 0;
          this.transferPercent = 0;
          this.transitPercent = 0;
          this.offPercent = 0;
          this.claimPercent = 0;
          this.outPercent = 0;

          this.message = 'No Record Found!';
      }
        this.donutChartData = [checkCount, transferCount, transitCount, offCount, claimCount, outCount, missCount];
        
       this.alertsReports(dateStartAlerts, dateEndAlerts, siteName);
        //var element = document.getElementById("spinner");
        //element.classList.remove("fa-spinner");
                
        });
   }
    public barChart(V3, V4, V5, V6, V7, V8, V9, V1, V2) {

      google.charts.load("current", { packages: ['corechart'] });
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ["Element", "Alerts", { role: "style" }],

          ["Check-in", V3, "#2188e0"],
          ["Transfer Loading", V4, "color: #279e3a"],
          ["In-Transit", V5, "color: #6d0404"],
          ["Off-loading", V6, "color: #39e11a"],
          ["Baggage Claim", V7, "color: #0b1cdd"],
          ["Check-out", V8, "color: #74ad6e"],
          ["Link Up", V9, "color: #006400"],
          ["Link Down", V1, "color: #808080"],
          ["Missing", V2, "color: #ff0000"]
        ]);

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
          {
            calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation"
          },
          2]);

        var options = {
          title: "",

          bar: { groupWidth: "95%" },
          legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
        chart.draw(view, options);
      }

  }

    public alertsReports(T1, T2, siteName) {

      //console.log(siteId);
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    });

    let options = {
      headers: httpHeaders
    };

this.http.get(`https://securene.co:9445/analytics/tables/ASSETS`, options)
            .subscribe((data2: Array<object>) => {
              
              this.assets = data2;
              //console.log(data2, "assets"); 

            });

      this.http.get(`https://securene.co:9445/analytics/tables/TAGS_ALERT_EVENTS5/`+ T1+'/'+T2, options)
      .subscribe((data: Array<object>) => {
      this.alertsAll = data;
        this.alerted = [];
        this.alertsSL =[];
        //console.log(data, "alerts");
        

        if(siteName == " "){
            if (data.length > 100) {
              data.reverse();
              this.alerts = data.slice(0, 99);
              this.alerts.reverse();
            }
            else {
              this.alerts = data;
            }

           for (let alerts of this.alerts) {

                 this.alerted.unshift({ asset_inventory_no: alerts.values.asset_inventory_no, site_name: alerts.values.site_name, event: alerts.values.event, timestamp: alerts.timestamp });

          }
        }
        else{
          
        for (let alerts of data) {


                if(alerts.values.site_name == siteName){
                this.alertsSL.unshift({ asset_inventory_no: alerts.values.asset_inventory_no, site_name: alerts.values.site_name, event: alerts.values.event, timestamp: alerts.timestamp });

                }
                 
          }
        if (this.alertsSL.length > 100) {
            //data.reverse();
            this.alerted = this.alertsSL.slice(0, 99);
            //this.alerts.reverse();
          }
          else {
            this.alerted = this.alertsSL;
          }
        }
          
        
 //console.log(this.alerts, "today Alerts");
        //console.log(data);

        //console.log(new Date('09/14/2018'));
        //console.log(new Date(data[0].timestamp));
        //console.log(MissingW,unauthorizedLocationW );

        var MissingCount = 0;
        var checkCount = 0;
        var transferCount = 0;
        var transitCount = 0;
        var offCount = 0;
        var claimCount = 0;
        var outCount = 0;
        var linkDownCount = 0;
        var linkUpCount = 0;
        
        if (data.length > 0) {
          this.alertsMessage = "";
        }
        else {
          this.alertsMessage = "No Alerts Found!";
          var element = document.getElementById("spinner");
               element.classList.remove("fa-spinner");
        }

        if(siteName == " "){
        for (var i = 0; i < data.length; i++) {

              var result = data[i].values.event;
              //console.log(data);

              if (result == 'Check-in Missing' || result == 'Transfer Loading Missing' || result == 'In-Transit Missing' || result == 'Off-loading Missing' || result == 'Baggage Claim Missing')
                      MissingCount = MissingCount + 1;
              
              if (result == 'Check-in')
                      checkCount = checkCount + 1;

              if (result == 'Transfer Loading')
                      transferCount = transferCount + 1;
              
              if (result == 'In-Transit')
                      transitCount = transitCount + 1;

              if (result == 'Off-loading')
                      offCount = offCount + 1;

              if (result == 'Baggage Claim')
                      claimCount = claimCount + 1;

              if (result == 'Check-out') 
                  outCount = outCount + 1;

              if (result == 'Link Down') 
                  linkDownCount = linkDownCount + 1;

              if (result == 'Link Up')
                  linkUpCount = linkUpCount + 1;
              
                var element = document.getElementById("spinner");
               element.classList.remove("fa-spinner");

        }
      } 
      else{
      for (var i = 0; i < data.length; i++) {
          if( data[i].values.site_name == siteName){
              var result = data[i].values.event;
              //console.log(data[i].values.site_name);

              if (result == 'Check-in Missing' || result == 'Transfer Loading Missing' || result == 'In-Transit Missing' || result == 'Off-loading Missing' || result == 'Baggage Claim Missing')
                      MissingCount = MissingCount + 1;
              
              if (result == 'Check-in')
                      checkCount = checkCount + 1;

              if (result == 'Transfer Loading')
                      transferCount = transferCount + 1;
              
              if (result == 'In-Transit')
                      transitCount = transitCount + 1;

              if (result == 'Off-loading')
                      offCount = offCount + 1;

              if (result == 'Baggage Claim')
                      claimCount = claimCount + 1;

              if (result == 'Check-out') 
                  outCount = outCount + 1;

              if (result == 'Link Down') 
                  linkDownCount = linkDownCount + 1;

              if (result == 'Link Up')
                  linkUpCount = linkUpCount + 1;
              
                var element = document.getElementById("spinner");
               element.classList.remove("fa-spinner");

            }


        }
      }
this.http.get(`https://securene.co:9445/analytics/tables/BATTERY_ALERT/`+ T1+'/'+T2,options)
              .subscribe((data:  Array<object>) => {

              this.Balerts = data;
              this.Balerts.reverse();
              //console.log(this.Balerts,"BA");
              if(siteName == " "){
                  for (let alerts of this.Balerts) {
                     this.batteryAlerts.unshift({tag_name: alerts.values.tag_name, asset_inventory_no: alerts.values.asset_inventory_no, site_name: alerts.values.site_name, event: alerts.values.event, timestamp: alerts.timestamp });    
                  }
               }
               else{
                   this.batteryAlerts = [];
                  for (let alerts of this.Balerts) {

                   if(alerts.values.site_name == siteName){
                     this.batteryAlerts.unshift({tag_name: alerts.values.tag_name, asset_inventory_no: alerts.values.asset_inventory_no, site_name: alerts.values.site_name, event: alerts.values.event, timestamp: alerts.timestamp }); 
                    }   
                  }
               }

              });
        
        this.barChart(checkCount, transferCount, transitCount, offCount, claimCount, outCount, linkUpCount, linkDownCount, MissingCount);
        setTimeout(function () {

          //$('#alertsTable').DataTable();
          //$('#historyTable').DataTable();

         }, 3000);
        });

  }

  public TAlerts() {

        var data = [];

         var HeaderData = [
            {
              asset_inventory_no: "Asset Inventory No.",
              site_name: "Site Name",
              event: "Event",
              Time: "Time",
              
            };
          // CONSOLE.LOG(this.siteIdFXlsx);
          //this.alertsAll.reverse();
          //console.log(this.alertsAll);
        if(this.siteIdFXlsx == " " || this.siteIdFXlsx == undefined){     

          this.alertsAll.reverse();
         for (let alerts of this.alertsAll) {


                var date = new Date(alerts.timestamp);
                 this.Talerted.unshift({ asset_inventory_no: alerts.values.asset_inventory_no, site_name: alerts.values.site_name, event: alerts.values.event,  Time: date.toString(), });


          }
      }
      else{
        for (let alerts of this.alertsAll) {
             if(alerts.values.site_name == this.siteIdFXlsx){

                    var date = new Date(alerts.timestamp);
                     this.Talerted.unshift({ asset_inventory_no: alerts.values.asset_inventory_no, site_name: alerts.values.site_name, event: alerts.values.event,  Time: date.toString(), });
              }

          }

      }
//console.log(this.Talerted, " rev");
          //if(this.alerts.length < 0 ){
          //this.alerted = [{"No Alerts Found!"}];
          //}
          //var tadata = HeaderData.concat(this.alerted);
 
new Angular5Csv(HeaderData.concat(this.Talerted), 'Alerts Report');
this.Talerted = [];
this.siteIdFXlsx= " ";



      } 

      
    themeColors = this.colorConfig.get().colors;

    //Donut Chart Config
    
public donutChartLabels: string[] = ["Check-in", "Transfer Loading", "In-Transit", "Off-loading", "Baggage Claim", "Check-out", "Missing"];
  public donutChartData: number[] = [0, 0, 0, 0, 0, 0, 0, 100];
  public donutChartDataWeek: number[] = [0, 0, 0, 0, 0];
  public donutChartDataMonth: number[] = [0, 0, 0, 0, 0];

  //public donutChartLabelsNull: string[] = ["Please Search"];
  //public donutChartDataNull: number[] = [10];

  public donutChartType: string = 'doughnut';
  public donutChartLegend: boolean = false;
  public dountChartOptions: any = {
    cutoutPercentage: 50,
    maintainAspectRatio: false
  }
  public donutChartColors: any = [{
    backgroundColor: [this.themeColors.info, this.themeColors.success, this.themeColors.warning, this.themeColors.successGreen, this.themeColors.infoBlue, this.themeColors.successLightGreen, this.themeColors.danger, this.themeColors.gray],
    // pointBackgroundColor : [this.themeColors.info, this.themeColors.primary, this.themeColors.success, this.themeColors.gray]
  }];

  public donutChartColorsNull: any = [{
    backgroundColor: [this.themeColors.gray],
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
