import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, faBookDead, faSearchLocation, faHome, faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { RoasterComponent } from './pages/roaster/roaster.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewRoasterComponent } from './pages/new-roaster/new-roaster.component';
import { NewCoffeeComponent } from './pages/new-coffee/new-coffee.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { BusinessComponent } from './pages/business/business.component';
import { HeaderComponent } from './header/header.component';
import { EditCoffeeComponent } from './pages/edit-coffee/edit-coffee.component';
import { EditRoasterComponent } from './pages/edit-roaster/edit-roaster.component';

@NgModule({
  declarations: [
    AppComponent,
    RoasterComponent,
    NewRoasterComponent,
    NewCoffeeComponent,
    LoginPageComponent,
    SignupPageComponent,
    HomeComponent,
    BusinessComponent,
    HeaderComponent,
    EditCoffeeComponent,
    EditRoasterComponent,  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee, faBookDead, faSearchLocation, faHome, faSearch, faEdit, faTrash);
  }
 }
