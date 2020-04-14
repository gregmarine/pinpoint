import { StorageService } from './../storage.service';
import { MapsService } from './../maps.service';
import { Component, OnInit } from '@angular/core';
import { Address } from '../address';
import { MouseEvent } from '@agm/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedAddress: Address = {
    addressLine1: '4 Yawkey Way',
    city: 'Boston',
    state: 'MA',
    zipCode: '02215',
    latitude: '42.3466764',
    longitude: '-71.0994065'
  };
  addresses: Address[] = [];
  hightlightedAddress: Address;

  constructor(
    private alertController: AlertController,
    private maps: MapsService,
    private storage: StorageService) {}

  async ngOnInit() {
    this.addresses = await this.storage.getAddresses();
  }

  public async onMapClick(event: MouseEvent) {
    const place = event.placeId || event.coords;
    const address = await this.maps.geocode(place);
    this.selectedAddress = await this.storage.saveAddress(address);
    this.addresses.push(this.selectedAddress);
  }

  async onDeleteClick(address: Address) {
    const alert = await this.alertController.create({
      header: 'Delete Address?',
      message: 'Are you sure you would like to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => console.log('canceled - do nothing')
        },
        {
          text: 'Delete it',
          handler: () => this.doDelete(address)
        }
      ]
    });

    await alert.present();
  }

  async doDelete(address: Address) {
    await this.storage.deleteAddress(address.addressId);
    this.hightlightedAddress = null;
    this.addresses = this.addresses.filter(addr => addr.addressId !== address.addressId);
  }
}
