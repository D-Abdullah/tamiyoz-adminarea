import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { UserService } from './_services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _authService: UserService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this._authService.loggedIn()) {

            return true;

        } else {
            this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;

        }

    }


}
