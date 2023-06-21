import { Component, OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tour of Heroes';
  heroes: Hero[] = [];
  constructor(private heroService: HeroService) {}

  ngOnInit(): void{
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
}
