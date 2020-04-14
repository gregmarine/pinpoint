import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { v1 as uuidv1 } from 'uuid';
import { Address } from './address';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  async saveAddress(address: Address): Promise<Address> {
    if (!address.addressId) {
      address.addressId = uuidv1();
    }

    await this.storage.set(address.addressId, address);
    return address;
  }

  async getAddresses(): Promise<Address[]> {
    const addresses = [];
    await this.storage.forEach(address => {
      if (address.addressId) {
        addresses.push(address);
      }
    });

    return addresses;
  }

  getAddress(addressId: string): Promise<Address> {
    return this.storage.get(addressId);
  }

  deleteAddress(addressId: string): Promise<any> {
    return this.storage.remove(addressId);
  }
}
