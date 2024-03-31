import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GithubService } from './github.service';

describe('GithubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [GithubService]
    });
  });

  it('should be created', () => {
    const service: GithubService = TestBed.inject(GithubService);
    expect(service).toBeTruthy();
  });

  it('should fetch user details from GitHub API', inject(
    [GithubService, HttpTestingController],
    (service: GithubService, httpMock: HttpTestingController) => {
      const mockResponse = {
        login: 'testuser',
        avatar_url: 'https://example.com/avatar.jpg',
        followers: 10,
        following: 5,
        public_repos: 20
      };

      const username = 'testuser';

      service.getUser(username).subscribe(user => {
        expect(user.login).toEqual(mockResponse.login);
        expect(user.avatar_url).toEqual(mockResponse.avatar_url);
        expect(user.followers).toEqual(mockResponse.followers);
        expect(user.following).toEqual(mockResponse.following);
        expect(user.public_repos).toEqual(mockResponse.public_repos);
      });

      const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      httpMock.verify();
    }
  ));
});
