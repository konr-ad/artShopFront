import { Component } from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
}
