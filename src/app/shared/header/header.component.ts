import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService, User } from '../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  search = new FormControl('');

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() {
    this.search.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(val => {
        const id = Number(val);
        if (!id) return of(null);
        return this.usersService.getUserById(id);
      })
    ).subscribe((user: User | null) => {
      if (user) {
        // navigate to details immediately
        this.router.navigate(['/users', user.id]);
      } else {
        // navigate to list
        this.router.navigate(['/']);
      }
    });
  }
}
