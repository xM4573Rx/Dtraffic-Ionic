import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';

declare var WifiWizard2: any;

@Component({
  selector: 'app-central',
  templateUrl: './central.page.html',
  styleUrls: ['./central.page.scss'],
})
export class CentralPage implements OnInit {

  net = '';
  pass = '';
  name = '';
  id = '';
  data: any;

  constructor(
    private nativeHttp: HTTP,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.connectToNet();
  }

  async readCentralData() {
    const url = 'http://192.168.4.1/read.json';

    const loading = await this.loadingCtrl.create();
    await loading.present();

    const nativeCall = this.nativeHttp.get(url, {}, {});

    from(nativeCall).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(data => {
      console.log('native data: ', data);
      this.data = data;
      console.log(this.data.data);
    }, error => {
      console.log('JS call error: ', error);
    });
  }

  async sendCentralData() {
    const url = 'http://192.168.4.1/data.json';

    this.data = {
      Red: this.net,
      Contrasena: this.pass,
      Nombre: this.name,
      ID: this.id
    };

    console.log(this.data);

    const loading = await this.loadingCtrl.create();
    await loading.present();

    const nativeCall = this.nativeHttp.post(url, this.data, {
      'Content-Type': 'application/json'
    });

    from(nativeCall).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(data => {
      console.log('native data: ', data);
      this.disconnectToNet();
    }, error => {
      console.log('JS call error: ', error);
    });
  }

  async connectToNet() {
    try {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      const state = await WifiWizard2.connect('ElectrikAppCentral', true, '12345678', 'WPA', false);
      console.log(state);
      loading.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  async disconnectToNet() {
    try {
      await WifiWizard2.remove('ElectrikAppCentral');
    } catch (error) {
      console.log(error);
    }
  }
}
