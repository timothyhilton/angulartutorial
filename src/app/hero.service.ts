import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  heroes: Hero[] = [];

  undefinedHero: Hero = {
    name: "No hero found",
    id: -1,
  };

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
      
      // check for heroes from last session
      if(localStorage.getItem('heroes') != null) {
        this.heroes = JSON.parse(localStorage.getItem('heroes') || '{}');
        this.log("got heroes from LS")
      }
      else {
        this.log("no past heroes");
        this.getHeroesFromHTTP()
          .subscribe( // not sure what the depreciation is?
            heroes => {this.heroes = heroes},
            err => {this.log(err)},
            () => {localStorage.setItem("heroes", JSON.stringify(this.heroes))} // saves hero array to localStorage once observable has resolved
            );
        this.log("saved heroes to LS");
      }
    }
  
  getHeroes(): Observable<Hero[]> {
    return of(this.heroes)
      .pipe(
        catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHeroesFromHTTP(): Observable<Hero[]> {
    this.log('fetched heroes from http');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', 
        []))
      );
  }

  updateLocalStorage(): void {
    localStorage.setItem("heroes", JSON.stringify(this.heroes));
  } 

  getHero(id: number): Hero {
    for(let i = 0; i < this.heroes.length; i++){ // this could use optimising
      if(this.heroes[i].id == id){
        this.log(`fetched hero with id ${id}`);
        return this.heroes[i];
      }
    }
    this.log(`no hero with id ${id}`)
    return this.undefinedHero;
  }

  updateHero(hero: Hero): void { // this could also use optimising
    for(let i = 0; i < this.heroes.length; i++){
      if(this.heroes[i].id == hero.id){
        this.heroes[i].name = hero.name;
        this.updateLocalStorage();
      }
    }
  }

  addHero(hero: Hero): void {
    hero.id = this.heroes[this.heroes.length - 1].id + 1;
    this.heroes.push(hero);
    this.updateLocalStorage();
  }

  deleteHero(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.updateLocalStorage();
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    // check each hero and append them to the results if their name matches the search query
    let results = []
    for(let i = 0; i < this.heroes.length; i++){
      if(this.heroes[i].name.includes(term)){
          results.push(this.heroes[i])
      }
    }
    return of(results).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
