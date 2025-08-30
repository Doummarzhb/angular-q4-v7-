import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}



  // note for this api link
//   The API you’re using (https://reqres.in/api/users
// ) shouldn’t require an API key; it’s free for testing. If you get {"error":"Missing API key"}, it’s usually because:
// You are using the wrong URL or changed it locally ,
// There’s a network or proxy issue blocking the request.

//for api

getUsers(page: number): Observable<any> {
  const url = `https://reqres.in/api/users?page=${page}`;
  if (this.cache.has(url)) return of(this.cache.get(url));
  return this.http.get(url).pipe(tap(data => this.cache.set(url, data)));
}

getUserById(id: number): Observable<any> {
  const url = `https://reqres.in/api/users/${id}`;
  if (this.cache.has(url)) return of(this.cache.get(url));
  return this.http.get(url).pipe(tap(data => this.cache.set(url, data)));
}



// for json file
  // getUsers(page: number): Observable<any> {
  //   const url = `assets/users.json`;
  //   if (this.cache.has(url)) return of(this.cache.get(url));
  //   return this.http.get(url).pipe(tap(data => this.cache.set(url, data)));
  // }

  // getUserById(id: number): Observable<any> {
  //   return this.getUsers(1).pipe(
  //     map(res => ({ data: res.data.find(u => u.id === id) }))
  //   );
  // }
}
