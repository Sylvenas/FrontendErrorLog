import { Component } from '@angular/core'
import { LoginService } from '../services/login/login.service'

@Component({
    selector: 'app-logon',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class Login {
    constructor( private loginService:LoginService){}
    handleLogin(userInfo) {
        this.loginService.login(userInfo).subscribe(res=>{
            console.log(res);
        })
        //console.log(userInfo);
    }
}