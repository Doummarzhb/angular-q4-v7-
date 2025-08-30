import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'] ,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class UsersListComponent implements OnInit {
  users = [];
  page = 1;
  totalPages = 1;
  loading = false;
  searchId: number;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers(this.page);
  }

  loadUsers(page: number) {
    this.loading = true;
    this.userService.getUsers(page).subscribe(res => {
      this.users = res.data;
      this.page = res.page;
      this.totalPages = res.total_pages;
      this.loading = false;
    });
  }

  goToUser(id: number) {
    this.router.navigate(['/user', id]);
  }

  searchUser() {
    if (!this.searchId) {
      this.loadUsers(1);
      return;
    }
    this.loading = true;
    this.userService.getUserById(this.searchId).subscribe(res => {
      if (res && res.data) {
        this.users = [res.data];
        this.totalPages = 1;
        this.page = 1;
      } else {
        this.users = [];
      }
      this.loading = false;
    }, err => {
      this.users = [];
      this.loading = false;
    });
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.loadUsers(this.page + 1);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.loadUsers(this.page - 1);
    }
  }
}
