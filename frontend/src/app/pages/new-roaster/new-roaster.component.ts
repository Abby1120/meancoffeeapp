import { Component, OnInit } from '@angular/core';
import { CoffeeService } from 'src/app/coffee.service';
import { Router } from '@angular/router';
import { Roaster } from 'src/app/models/roaster.model'; 
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-roaster',
  templateUrl: './new-roaster.component.html',
  styleUrls: ['./new-roaster.component.scss']
})
export class NewRoasterComponent implements OnInit {

  constructor(private coffeeService: CoffeeService, private router: Router, private _location: Location) { }

  ngOnInit() {
  }

  backClicked() {
    this._location.back();
  };
  
  createRoaster(title: string) {
    this.coffeeService.createRoaster(title).subscribe((roaster: Roaster) => {
      console.log(roaster);
      // Now we navigate to /roaster/coffee._id
      this.router.navigate([ '/roaster', roaster._id ])
    });
  }

}
