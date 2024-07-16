import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '../common-services.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: any;
  selectedFile: File | null = null;
  constructor(private httpService: CommonServicesService, private toastController: ToastController,private router: Router) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.httpService.getUserProfile()
      .subscribe(
        (data: any) => {
          this.user = data["data"];
          this.user['filePath'] = `${this.httpService.url}/files/images/${this.user['fileName']}`;
          // this.user['filePath'] = this.httpService.url+'files/images/'+this.user['fileName'];

          this.httpService.getImage(this.user['filePath'])
            .subscribe(response => {
              this.createImageFromBlob(response);
            }, error => {
              console.error('Error fetching image:', error);
              // Handle error
            });

        },
        (error) => {
          console.error('Error loading user profile:', error);
          // Optionally handle errors, such as redirecting to login if token is invalid
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      );
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.user.imageUrl = reader.result as string; // Store the image data URL for binding in template
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  updateUserProfile() {
    // Prepare form data with updated user data
    const formData = new FormData();
    formData.append('firstName', this.user.firstName);
    formData.append('lastName', this.user.lastName);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    // Call your service method to update profile
    this.httpService.updateUserProfile(formData)
      .subscribe(
        (response) => {
          // Handle success, maybe show a success message or navigate to another page
          this.presentToast('Profile updated successfully')
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.presentToast(`Error updating profile: ${error}`)

          // Handle error
        }
      );
  }

  onFileSelected(event: any) {
    // Capture the selected file
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // Optional: Preview the selected image
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.user.imageUrl = reader.result as string;
      };
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}

