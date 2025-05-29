import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  standalone: false,
  styleUrl: './root.component.scss'
})
export class RootComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
