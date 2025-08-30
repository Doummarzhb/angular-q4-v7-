import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of , BehaviorSubject } from 'rxjs';
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
  private searchResultsSubject = new BehaviorSubject<User[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private http: HttpClient) {}

  searchUserById(id: number) {
    if (id === null || id === undefined) return;

    if (this.userCache.has(id)) {
      this.searchResultsSubject.next([this.userCache.get(id)!]);
    } else {
      this.getUserById(id).subscribe(user => {
        this.searchResultsSubject.next(user ? [user] : []);
      });
    }
  }

  getUsers(page: number): Observable<{ data: User[]; total_pages: number; page: number; support?: any }> {
    if (this.pageCache.has(page)) {
      return of({
        data: this.pageCache.get(page)!,
        total_pages: Math.max(1, this.pageCache.size),
        page
      });
    }
    return this.http.get<any>(`/api/users?page=${page}`).pipe(
      tap(res => {
        res.data.forEach((u: User) => this.userCache.set(u.id, u));
        this.pageCache.set(page, res.data);
      }),
      map(res => ({ data: res.data as User[], total_pages: res.total_pages, page: res.page, support: res.support })),
      catchError(err => of({ data: [], total_pages: 0, page: 1 }))
    );
  }

  getUserById(id: number): Observable<User | null> {
    if (this.userCache.has(id)) {
      return of(this.userCache.get(id)!);
    }

    return this.http.get<any>(`/api/users/${id}`).pipe(
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
