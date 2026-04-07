import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.authService.logout();
    }
  }
  
  logout() {
    this.authService.logout();
  }
}