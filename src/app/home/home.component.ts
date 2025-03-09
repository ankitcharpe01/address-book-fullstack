import { Component } from '@angular/core';
import { GetService } from '../services/get.service';
import { DeleteService } from '../services/delete.service';
import { EditService } from '../services/edit.service';
import { CommonModule } from '@angular/common';
import { FormComponentComponent } from '../form-component/form-component.component';
import { EditStateService } from '../services/edit-state.service';
export interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  id: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule ,FormComponentComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedAddress: Address | undefined = undefined;
  addresses: Map<number, Address> = new Map();


  constructor(
    private getService: GetService,
    private editService: EditService,
    private deleteService: DeleteService,
    private editStateService: EditStateService
  ) {
    this.fetchData();
  }

  openForm() {
    this.editStateService.setIsForm(true);
  }

  closeForm() {
    this.editStateService.setIsForm(false);
  }
  setEdit(value: boolean){
    this.editStateService.setIsEdit(value);
  }
  getEdit(){
    return this.editStateService.getIsEdit();
  }
  getForm(){
    return this.editStateService.getIsForm();
  }
  fetchData() {
    this.getService.getData().subscribe({
      next: (data: Address[]) => {
        this.addresses = new Map(data.map(address => [address.id, address]));
        console.log('Data received:', this.addresses);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  addNewPerson(person: Address) {
    this.addresses.set(person.id,person);
    this.closeForm();
  }

  deleteAddress(person: Address) {
    this.deleteService.deleteData(person);
    this.addresses.delete(person.id);
  }
  
  editAddress(person: Address) {
    this.selectedAddress = { ...person }; 
    this.editStateService.setPersonId(person.id);
    this.openForm();
  }
  updateAddress() {
    if (!this.selectedAddress) {
      console.error("Error: No address selected for update.");
      return; 
    }
    this.addresses.set(this.selectedAddress.id, this.selectedAddress);
    this.editService.editData(this.selectedAddress).subscribe({
      next: (response) => {
        console.log('Address updated:', response);
        this.fetchData(); 
        this.closeForm();
      },
      error: (error) => {
        console.error('Error updating address:', error);
      }
    });
  }
}
