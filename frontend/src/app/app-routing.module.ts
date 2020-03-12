import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewRoasterComponent } from './pages/new-roaster/new-roaster.component';
import { BusinessComponent } from './pages/business/business.component';
import { RoasterComponent } from './pages/roaster/roaster.component';
import { NewCoffeeComponent } from './pages/new-coffee/new-coffee.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditRoasterComponent } from './pages/edit-roaster/edit-roaster.component';
import { EditCoffeeComponent } from './pages/edit-coffee/edit-coffee.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'new-roaster', component: NewRoasterComponent },
  { path: 'edit-roaster/:roasterId', component: EditRoasterComponent },
  { path: 'business', component: BusinessComponent},
  { path: 'roaster',  component: RoasterComponent },
  { path: 'roaster/:roasterId', component: RoasterComponent },
  { path: 'roaster/:roasterId/new-coffee', component: NewCoffeeComponent },
  { path: 'roaster/:roasterId/edit-coffee/:coffeeId', component: EditCoffeeComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
