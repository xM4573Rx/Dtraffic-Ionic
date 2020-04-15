import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare var WifiWizard2: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  results = [];
  infoText = '';
  data = [];

  constructor(
    private router: Router
  ) {
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

    for (const x of this.results) {
      this.data.push(x.SSID);
    }

    for (const i of this.data) {
      if (i === 'ElectrikAppPunto') {
        console.log('OK');
        this.router.navigate(['/node']);
      }
    }
  }

  networks(data) {
    console.log(data);
  }
}
