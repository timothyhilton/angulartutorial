import { Injectable } from '@angular/core';
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'https://localhost:7002/Hero';
  
  heroes: Hero[] = [];
  heroesSubject = new BehaviorSubject(this.heroes);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {

      this.updateSubject();

    }
  
  getHeroes(): Observable<Hero[]> {
    return this.heroesSubject;
  }  

  getHero(id: number): Observable<Hero> {
    this.log(`got hero with id ${id}`);
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`);
  }

  updateHero(hero: Hero): void {
    this.log(`updated hero with id ${hero.id}`);
    this.http.put<any>(`${this.heroesUrl}/${hero.id}`, hero)
      .subscribe(() => this.updateSubject());
  }

  addHero(hero: Hero): void {
    this.log(`added hero with id ${hero.id}`);
    this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .subscribe(() => this.updateSubject());
    return;
  }

  deleteHero(hero: Hero): void {
    this.log(`deleted hero with id ${hero.id}`)
    this.http.delete<Hero>(`${this.heroesUrl}/${hero.id}`, this.httpOptions)
      .subscribe(() => this.updateSubject());
  }

  updateSubject(): void {
    this.log("updated frontend from api")
    this.http.get<Hero[]>(this.heroesUrl)
      .subscribe(heroes => this.heroesSubject.next(heroes));
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/search/${term}`)
      .pipe(
        tap(heroes => heroes.length ?
          this.log(`found heroes matching "${term}"`) :
          this.log(`no heroes matching "${term}"`))
      );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
