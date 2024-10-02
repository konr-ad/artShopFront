import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [
        RouterLink
    ],
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

}
