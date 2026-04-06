import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
  ) {}

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

    this.authService.loginApi(this.username, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          this.loading = false;
          console.error('Login failed', err);
          alert('Sai tài khoản hoặc mật khẩu');
        }
      });
  }
}