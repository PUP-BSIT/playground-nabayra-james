import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';

@Injectable()
export class CountryService {
  cache: { [key:string]: any} = {};

  constructor(private http: HttpClient) {}

  getCountryByName(keyword: string) {
    if(keyword in this.cache) {
      return of(this.cache[keyword]);
    }

    const api = `https://restcountries.com/v3.1/name/${keyword}`;
    return this.http.get(api).pipe(
      tap((response)=>{
        this.cache[keyword] = response;
      })
    );
  }
}