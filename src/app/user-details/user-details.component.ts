import { Component, OnDestroy, OnInit } from '@angular/core';
import { GithubService } from '../github.service';
import { ErrorInterceptorService } from '../error-interceptor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  userName: string = '';
  user: any;
  error: string = '';
  detailsButtonDisabled: boolean = false;

  constructor(
    private githubService: GithubService,
    private errorInterceptorService: ErrorInterceptorService
    //private subscription: Subscription
  ) {}

  ngOnInit() {
    this.errorInterceptorService.getErrorMessage().subscribe(errorMessage => {
      this.error = errorMessage;
      //this.user = null;
    });
  }

  onInputChange() {
    // Enable the button if the input field is not empty
    this.detailsButtonDisabled = this.userName.trim() === '';
  }

  getUserDetails() {
    this.detailsButtonDisabled = true;
    if(!this.userName.trim()) {
      this.error = "Please enter a username";
      return;
    }
    this.githubService.getUser(this.userName.trim()).subscribe(
      (user: any) => {
        this.user = user;
        this.error = '';
      },
      (error) => {
        // Error handling is now done by the interceptor
        this.error = error;
        this.user = null;
        /*if (error.status === 404) {
          this.error = 'User does not exist';
          this.user = null;
        } else {
          this.error = error.message || 'An error occurred';
          this.user = null;
        }
        */
      }
    );
  }

  clearUserDetails() {
    this.userName = '';
    this.user = null;
    this.error = '';
  }

  /*
  ngOnDestroy(): void {
      if(this.subscription) {
        this.subscription.unsubscribe();
      }
  }*/
}
