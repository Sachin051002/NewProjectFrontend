import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CommonServicesService } from '../common-services.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email!: string;
  password!: string;
  constructor(private httpService: CommonServicesService, private toastController: ToastController, private router: Router) { }


  login() {
    const loginData = {
      email: this.email || '',
      password: this.password || ''
    };

    this.httpService.login(loginData)
      .subscribe(
        (response) => {
          console.log('Login Successful:', response);
          this.presentToast('Login Successful');
          
          // Redirect to a different page or perform any post-login action
          this.router.navigate(['/user-profile']);
        },
        (error) => {
          console.error('Login Error:', error);
          this.presentToast('Login Failed');
        }
      );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

}
