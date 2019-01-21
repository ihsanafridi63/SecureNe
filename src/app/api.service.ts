import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
printToConsole(arg){
	console.log(arg);
}

constructor() {}

}
