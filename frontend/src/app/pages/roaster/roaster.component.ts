import { Component, OnInit } from '@angular/core';
import { CoffeeService } from 'src/app/coffee.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Coffee } from 'src/app/models/coffee.model';
import { Roaster } from 'src/app/models/roaster.model';



@Component({
  selector: 'app-roaster',
  templateUrl: './roaster.component.html',
  styleUrls: ['./roaster.component.scss']
})
export class RoasterComponent implements OnInit {

  roaster: Roaster[];
  coffee: Coffee[];

  selectedRoasterId: string;

  constructor(private coffeeService: CoffeeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.roasterId) {
          this.selectedRoasterId = params.roasterId;
          this.coffeeService.getCoffee(params.roasterId).subscribe((coffee: Coffee[]) => {
            this.coffee = coffee;
          })
        } else {
          this.coffee = undefined;
        }
      }
    )

    this.coffeeService.getRoaster().subscribe((roaster: Roaster[]) => {
      this.roaster = roaster;
    })
  }

  onCoffeeClick(coffee: Coffee) {
    // we want to set the task to completed
    this.coffeeService.complete(coffee).subscribe(() => {
      // the task has been set to completed successfully
      console.log("Completed successully!");
      coffee.completed = !coffee.completed;
    })
  }
  
  onDeleteRoasterClick() {
    this.coffeeService.deleteRoaster(this.selectedRoasterId).subscribe((res: any) => {
      this.router.navigate(['/roaster']);
      console.log(res);
    })
  }

  onDeleteCoffeeClick(id: string) {
    this.coffeeService.deleteCoffee(this.selectedRoasterId, id).subscribe((res: any) => {
      this.coffee = this.coffee.filter(val => val._id !== id);
      console.log(res);
    })
  }

}
