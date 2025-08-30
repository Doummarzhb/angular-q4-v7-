import { Component, OnInit } from '@angular/core';
import { UsersService, User } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  page = 1;
  totalPages = 1;
  searchId: number | null = null;
  supportInfo: any = null;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() {
    this.loadPage(1);

    this.usersService.searchResults$.subscribe(results => {

      if (results.length) {
        this.users = results;
        this.totalPages = 1;
        this.supportInfo = (results[0] as any).support || null;
      } else if(this.searchId) {
        this.users = [];
        this.supportInfo = null;
      }
    });
  }


  loadPage(page: number) {
    this.loading = true;
    this.usersService.getUsers(page).subscribe(res => {
      this.users = res.data;
      this.totalPages = res.total_pages;
      this.page = res.page;
      this.supportInfo = res.support || null;
      this.loading = false;
    });
  }

  onSearch() {
    if (this.searchId) {
      this.usersService.searchUserById(this.searchId);
    }
  }

  clearSearch() {
    this.searchId = null;
    this.loadPage(1);
  }

  goToUser(id: number) {
    this.router.navigate([`/users/${id}`]);
  }
  prev() { if (this.page > 1) this.loadPage(this.page - 1); }
  next() { if (this.page < this.totalPages) this.loadPage(this.page + 1); }
}
