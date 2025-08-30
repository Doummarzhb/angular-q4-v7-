import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  users = [];
  loading = false;
  page = 1;
  totalPages = 1;
  searchId: number;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
    // this.loadUsers(2);
  }

  loadUsers(page: number = 1) {
    this.loading = true;
    this.userService.getUsers(page).subscribe(res => {
      this.users = res.data;
      this.totalPages = res.total_pages;
      this.page = res.page;
      this.loading = false;
    });
  }

  goToUser(id: number) {
    this.router.navigate(['/user', id]);
  }

  searchUser() {
    if (this.searchId) {
      this.loading = true;
      this.userService.getUserById(this.searchId).subscribe(res => {
        this.users = [res.data];
        this.totalPages = 1;
        this.page = 1;
        this.loading = false;
      }, err => {
        this.users = [];
        this.loading = false;
      });
    } else {
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) this.loadUsers(this.page + 1);
  }

  prevPage() {
    if (this.page > 1) this.loadUsers(this.page - 1);
  }
}
