import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailsComponent } from './user-details.component';
import { GithubService } from '../github.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let githubServiceMock: jasmine.SpyObj<GithubService>;

  beforeEach(async () => {
    // Create a mock GithubService
    githubServiceMock = jasmine.createSpyObj<GithubService>('GithubService', ['getUser']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailsComponent],
      providers: [
        { provide: GithubService, useValue: githubServiceMock }
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user details', () => {
    // Setup
    const mockUser = { login: 'testuser', avatar_url: 'https://example.com/avatar.jpg', followers: 10, following: 5, public_repos: 20 };
    githubServiceMock.getUser.and.returnValue(of(mockUser));

    // Call getUserDetails method
    component.userName = 'testuser';
    component.getUserDetails();

    // Check if getUser method of GithubService is called with correct username
    expect(githubServiceMock.getUser).toHaveBeenCalledWith('testuser');

    // Check if user details are set correctly
    expect(component.user).toEqual(mockUser);
    expect(component.error).toEqual('');
  });

  it('should handle error when getting user details', () => {
    // Setup
    const errorMessage = 'An error occurred';
    githubServiceMock.getUser.and.returnValue(throwError(errorMessage));

    // Call getUserDetails method
    component.userName = 'testuser';
    component.getUserDetails();

    // Check if getUser method of GithubService is called with correct username
    expect(githubServiceMock.getUser).toHaveBeenCalledWith('testuser');

    // Check if error message is set correctly
    expect(component.user).toBeNull();
    expect(component.error).toEqual(errorMessage);
  });

  it('should clear user details', () => {
    // Set initial values
    component.userName = 'testuser';
    component.user = { login: 'testuser', avatar_url: 'https://example.com/avatar.jpg', followers: 10, following: 5, public_repos: 20 };
    component.error = 'Some error message';

    // Call clearUserDetails method
    component.clearUserDetails();

    // Check if values are cleared
    expect(component.userName).toEqual('');
    expect(component.user).toBeNull();
    expect(component.error).toEqual('');
  });
});
