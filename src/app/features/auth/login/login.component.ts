import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    if (!this.username || !this.password) {
      alert('Nhập đầy đủ thông tin');
      return;
    }

    this.loading = true;

    this.authService.loginApi(this.username, this.password).pipe(
      switchMap(() => this.authService.getProfile(this.username, this.password))

    ).subscribe({
      next: (res) => {
        this.loading = false;

        const user = res.data?.User;

        if (!user) {
          alert('Không lấy được thông tin user');
          return;
        }

        // lưu user
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Login lỗi');
      }
    });
  }
}