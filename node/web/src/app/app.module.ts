import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './guard/auth.guard';

import { LoginService } from './services/login/login.service';
import { JoinService } from './services/join/join.service';
import { PreviewService } from './services/preview/preview.service';

import { AppComponent } from './app.component';
import { Home } from './home/home.component';
import { Login } from './login/login.component';
import { PreviewComponent } from './preview/preview.component';
import { JoinComponent } from './join/join.component';

@NgModule({
  declarations: [
    AppComponent,
    Home,
    Login,
    PreviewComponent,
    JoinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    LoginService,
    JoinService,
    PreviewService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
