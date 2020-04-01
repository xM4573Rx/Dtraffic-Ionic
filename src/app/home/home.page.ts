import { Component } from '@angular/core';

declare var WifiWizard2: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  results = [];
  infoText = '';

  constructor() {
    this.getSSID();
  }

  async getSSID() {
    this.infoText = 'Loading...';
    try {
      const results = await WifiWizard2.scan();
      this.results = results;
      this.infoText = '';
    } catch (error) {
      this.infoText = error;
    }
    console.log(this.results);
  }
}
