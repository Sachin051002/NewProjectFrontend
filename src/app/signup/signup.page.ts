import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CommonServicesService } from '../common-services.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
// export class SignupPage implements OnInit {
//   username!: string;
//   password!: string;

//   constructor() { }

//   signup() {
//     // Implement your signup logic here
//     console.log('Username:', this.username);
//     console.log('Password:', this.password);

//     // Example: You can add HTTP requests to your backend here
//   }
//   ngOnInit() {
//   }

// }
export class SignupPage {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  imageFile: File | undefined;

  constructor(private httpService:CommonServicesService, private toastController: ToastController, private router:Router) {}

  async signup() {

    const formData = new FormData();
    formData.append('firstName', this.firstName ||'');
    formData.append('lastName', this.lastName ||'');
    formData.append('email', this.email ||'');
    formData.append('password', this.password ||'');
    if (this.imageFile) {
      formData.append('file', this.imageFile, this.imageFile.name);
    }

    this.httpService.signup(formData)
      .subscribe(
        (response) => {
          console.log('Signup Successful:', response);
          this.presentToast('Signup Successful');
          this.router.navigate(['/login'])
        },
        (error) => {
          console.error('Signup Error:', error);
          this.presentToast('Signup Failed');
        }
      );
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.imageFile = file;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }
}


