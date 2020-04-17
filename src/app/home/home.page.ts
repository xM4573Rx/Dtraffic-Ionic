import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

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
  sub: any;

  constructor(
    private router: Router
  ) {
    this.sub = interval(10000)
    .subscribe((val) => {
      console.log('called');
      this.getSSID();
    });
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
        this.sub.unsubscribe();
        this.router.navigate(['/node']);
      }

      if (i === 'ElectrikAppCentral') {
        console.log('OK');
        this.sub.unsubscribe();
        this.router.navigate(['/central']);
      }
    }
  }

  networks(data) {
    console.log(data);
  }
}
