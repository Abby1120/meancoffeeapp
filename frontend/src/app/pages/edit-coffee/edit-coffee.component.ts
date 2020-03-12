import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { CoffeeService } from 'src/app/coffee.service';

@Component({
  selector: 'app-edit-coffee',
  templateUrl: './edit-coffee.component.html',
  styleUrls: ['./edit-coffee.component.scss']
})
export class EditCoffeeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private coffeeService: CoffeeService, private router: Router) { }
  
  coffeeId: string;
  roasterId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.coffeeId = params.coffeeId;
        this.roasterId = params.roasterId;
      }
    )
  }

  updateCoffee(title: string) {
    this.coffeeService.updateCoffee(this.roasterId, this.coffeeId, title).subscribe(() => {
      this.router.navigate(['/roaster', this.roasterId]);
    })
  }
}
