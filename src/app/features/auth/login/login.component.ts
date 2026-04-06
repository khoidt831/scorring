import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      window.location.href = '/dashboard';
    }
  }

  login() {
    // giả lập gọi API
    const fakeToken = 'abc123.jwt.token';

    this.authService.login(fakeToken);
  }
  

}
