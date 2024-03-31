import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  private errorMessageSubject = new BehaviorSubject<string>('');

  private errorMessage = this.errorMessageSubject.asObservable();

  constructor() { }

  getErrorMessage() {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    return this.errorMessageSubject.next(message);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 404) {
            errorMessage = 'User does not exist.';
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        }
        this.errorMessageSubject.next(errorMessage);
        //console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}
