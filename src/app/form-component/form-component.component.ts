import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { CreateService } from '../services/create.service';
import { EditService } from '../services/edit.service';
import { HomeComponent } from "../home/home.component";
import { EditStateService } from '../services/edit-state.service';
import { CommonModule } from "@angular/common";

export class Address {
  constructor(
    public fullName: string,
    public address: string,
    public city: string,
    public state: string,
    public zipCode: string,
    public phoneNumber: string,
    public id: number
  ) {}
}
@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule], 
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnChanges {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() editAddressData?: Address;

  constructor(
    private createService: CreateService,
    private editService: EditService,
    private editStateService: EditStateService
  ) {}

  addressForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6}$")]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")])
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editAddressData'] && this.editAddressData) {
      // this.editStateService.setIsEdit(true); 
      this.addressForm.patchValue(this.editAddressData);
    } else {
      // this.editStateService.setIsEdit(false); 
      this.addressForm.reset();  
    }
  }

  isEdit(){
    return this.editStateService.getIsEdit();
  }
  setForm(value: boolean){
    return this.editStateService.setIsForm(value);
  }

onSubmit() {
  if (this.isEdit()) {
    this.updateAddress();
  } else {
    this.addNewAddress();
  }
}

addNewAddress() {
  if (this.addressForm.valid) {
    const formData = this.addressForm.getRawValue();
    this.createService.submitForm(formData).subscribe({
      next: (response) => {
        console.log('Form Submitted Successfully:', response);
        this.formSubmitted.emit(formData); 
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        console.log('Failed to submit form!');
      }
    });
  } else {
    console.log("Form is invalid");
  }
}


updateAddress() {
  if (this.addressForm.valid) {
    const updatedData: Address = {
      id: this.editStateService.getPersonId(), 
      fullName: this.addressForm.value.fullName ?? "",
      address: this.addressForm.value.address ?? "",
      city: this.addressForm.value.city ?? "",
      state: this.addressForm.value.state ?? "",
      zipCode: this.addressForm.value.zipCode ?? "",
      phoneNumber: this.addressForm.value.phoneNumber ?? "",
    };
    this.editService.editData(updatedData).subscribe({
      next: (response) => {
        console.log("Address Updated Successfully:", response);
        this.formSubmitted.emit(updatedData);
        this.closeForm.emit(); // Close form after update
      },
      error: (error) => {
        console.error("Error updating address:", error);
        console.log("Failed to update address!");
      }
    });
  } else {
    console.log("Form is invalid");
  }
} 
}