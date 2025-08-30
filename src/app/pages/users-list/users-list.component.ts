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

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() { this.load(this.page); }

  load(page: number) {
    this.loading = true;
    this.usersService.getUsers(page).subscribe(res => {
      this.users = res.data;
      this.totalPages = res.total_pages || 1;
      this.page = res.page || page;
      this.loading = false;
    });
  }

  goToUser(id: number) { this.router.navigate(['/users', id]); }
  prev() { if (this.page > 1) this.load(this.page - 1); }
  next() { if (this.page < this.totalPages) this.load(this.page + 1); }
}
