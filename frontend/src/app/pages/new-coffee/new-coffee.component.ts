import { Component, OnInit } from '@angular/core';
import { CoffeeService } from 'src/app/coffee.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Coffee } from 'src/app/models/coffee.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-coffee',
  templateUrl: './new-coffee.component.html',
  styleUrls: ['./new-coffee.component.scss']
})
export class NewCoffeeComponent implements OnInit {

  constructor(private coffeeService: CoffeeService, private route: ActivatedRoute, private router: Router, private _location: Location) { }

  roasterId: string;
  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.roasterId = params['roasterId'];
      }
    )
  }

  backClicked() {
    this._location.back();
  };

  createCoffee(title: string) {
    this.coffeeService.createCoffee(title, this.roasterId).subscribe((newCoffee: Coffee) => {
      console.log(newCoffee);
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }

}
