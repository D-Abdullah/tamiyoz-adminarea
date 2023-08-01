import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { UserService } from './_services/user.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(req, next) {

        let authService = this.injector.get(UserService);

        let tokenizedReq = req.clone({

            setHeaders: { Authorization: `Bearer ${authService.getToken()}` }
            // setHeaders: { Authorization: `${authService.getToken()}` }

        })

        return next.handle(tokenizedReq);

    }

}
