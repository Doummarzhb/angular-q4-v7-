import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  email?: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private userCache = new Map<number, User>();
  private pageCache = new Map<number, User[]>();

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<{ data: User[]; total_pages: number; page: number }> {
    if (this.pageCache.has(page)) {
      return of({ data: this.pageCache.get(page)!, total_pages: this.pageCache.size ?  Math.max(1, this.pageCache.size) : 1, page });
    }
    return this.http.get<any>(`https://reqres.in/api/users?page=${page}`).pipe(
      tap(res => {
        res.data.forEach((u: User) => this.userCache.set(u.id, u));
        this.pageCache.set(page, res.data);
      }),
      map(res => ({ data: res.data as User[], total_pages: res.total_pages, page: res.page })),
      catchError(err => {
        console.error('API error', err);
        return of({ data: [], total_pages: 0, page: 1 });
      })
    );
  }

  getUserById(id: number): Observable<User | null> {
    if (this.userCache.has(id)) {
      return of(this.userCache.get(id)!);
    }
    return this.http.get<any>(`https://reqres.in/api/users/${id}`).pipe(
      map(res => {
        const u = res.data as User;
        this.userCache.set(u.id, u);
        return u;
      }),
      catchError(err => {
        console.warn('User not found or API error', err);
        return of(null);
      })
    );
  }
}
