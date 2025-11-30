import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    TranslatePipe
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit {
  protected invalidPath: string;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {
    this.invalidPath = '';
  }

  ngOnInit(): void {
    this.invalidPath = this.route.snapshot.url.map(url => url.path).join('/');
  }

  protected onNavigateHome() {
    this.router.navigate(['register']).then();
  }
}
