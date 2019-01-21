import { Injectable } from '@angular/core';

@Injectable()
export class ThemeConstants {
    
    private colorConfig: any;
    
    constructor() {
        this.colorConfig = {
            colors: {
                primary: '#7774e7',
                info: '#2188e0',
                infoBlue: '#0b1cdd',
                success: '#279e3a',
                successGreen: '#39e11a',
                successLightGreen: '#74ad6e',
                successDarkGreen: '#006400',
                warning: '#6d0404',
                danger: '#ff0000',
                primaryInverse: 'rgba(119, 116, 231, 0.1)',
                infoInverse: 'rgba(15, 154, 238, 0.1)',
                successInverse: 'rgba(55, 201, 54, 0.1)',
                warningInverse: 'rgba(255, 204, 0, 0.1)',
                dangerInverse: 'rgba(255, 60, 126, 0.1)',
                gray: '#ebeef6',
                white: '#ffffff',
                dark: '#515365',
            }
        };
    }
    
    get() {
        return this.colorConfig;
    }
}