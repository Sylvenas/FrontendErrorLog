import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Component({
    selector: 'app-logon',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class Login {

    private passwordErr: boolean = false;

    constructor(private loginService: LoginService, private router: Router) { }

    handleLogin(userInfo) {
        this.loginService.login(userInfo).subscribe(res => {
            if (res.status) {
                this.passwordErr = false;
                this.router.navigate(['/preview']);
            } else {
                this.passwordErr = true;
            }
        })
    }
}