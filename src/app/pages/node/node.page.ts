import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';

declare var WifiWizard2: any;

@Component({
  selector: 'app-node',
  templateUrl: './node.page.html',
  styleUrls: ['./node.page.scss'],
})
export class NodePage implements OnInit {

  net = '';
  pass = '';
  name = '';
  location = '';
  id = '';
  data: any;
  films: Observable<any>;

  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.connectToNet();
  }

  async readNodeData() {
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

  async sendNodeData() {
    const url = 'http://192.168.4.1/data.json';

    this.data = {
      Red: this.net,
      Contrasena: this.pass,
      Nombre: this.name,
      Ubicacion: this.location,
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
      const state = await WifiWizard2.connect('ElectrikAppPunto', true, '12345678', 'WPA', false);
      console.log(state);
      loading.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  async disconnectToNet() {
    try {
      await WifiWizard2.remove('ElectrikAppPunto');
    } catch (error) {
      console.log(error);
    }
  }
}
