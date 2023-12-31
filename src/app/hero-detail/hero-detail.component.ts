import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}
  
  @Input() hero?: Hero;
  
  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hero = this.heroService.getHero(id);
  }  

  ngOnInit(): void {
    this.getHero();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.hero){
      this.heroService.updateHero(this.hero);
      this.goBack();
    }
  }
}
