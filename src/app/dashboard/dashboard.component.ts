import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  dashHeroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit(): void{
    this.heroService.getHeroes()
      .subscribe(heroes => this.dashHeroes = heroes.slice(0, 4));
  }
}