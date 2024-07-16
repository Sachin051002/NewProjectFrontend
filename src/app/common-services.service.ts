import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {
  public url = 'http://localhost:5444'
  // public url = 'https://10ce-103-44-53-142.ngrok-free.app'
  constructor(private http: HttpClient) { }

  signup(formData: FormData) {
    return this.http.post(`${this.url}/register`, formData);
  }

  login(loginData: { email: string; password: string }) {
    return this.http.post(`${this.url}/login`, loginData, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<any>) => {
          const token = response.body.token;
          if (token) {
            localStorage.setItem('authToken', token);
          }
        })
      );
  }

  getHeader() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': "hakuna matata"
    });
  }

  getUserProfile() {
    const headers = this.getHeader();
    return this.http.get(this.url + `/user/profile`, { headers });
  }

  getImage(imageUrl: string): Observable<Blob> {
    const headers = this.getHeader();
    return <any>this.http.get(imageUrl, {
      headers: headers,
      responseType: 'blob' as 'json' // Specify responseType as blob
    });
  }

  updateUserProfile(formData: FormData) {
    const headers = this.getHeader();
    return this.http.post(`${this.url}/user/updateProfile`, formData, { headers });
  }
  // getProtectedData() {
  //   const url = 'http://localhost:5444/protected'; // Adjust URL as per your backend API endpoint
  //   return this.http.get(url, { headers });
  // }
}
