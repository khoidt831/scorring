import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

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
