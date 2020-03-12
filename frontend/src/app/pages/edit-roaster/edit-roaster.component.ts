import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CoffeeService } from 'src/app/coffee.service';

@Component({
  selector: 'app-edit-roaster',
  templateUrl: './edit-roaster.component.html',
  styleUrls: ['./edit-roaster.component.scss']
})
export class EditRoasterComponent implements OnInit {

  constructor(private route: ActivatedRoute, private coffeeService: CoffeeService, private router: Router) { }

  roasterId: string;

  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.roasterId = params.roasterId;
        console.log(params.roasterId);
      }
    )
  }

  updateRoaster(title: string) {
    this.coffeeService.updateRoaster(this.roasterId, title).subscribe(() => {
      this.router.navigate(['/roaster', this.roasterId]);
    })
  }

}
