import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Coffee } from './models/coffee.model';

@Injectable({
  providedIn: 'root'
})
export class CoffeeService {

  constructor(private webReqService: WebRequestService) { }

  
  getRoaster() {
    return this.webReqService.get('roaster');
  }

  createRoaster(title: string) {
    // We want to send a web request to create a roaster
    return this.webReqService.post('roaster', { title });
  }

  updateRoaster(id: string, title: string) {
    // We want to send a web request to update a roaster
    return this.webReqService.patch(`roaster/${id}`, { title });
  }

  updateCoffee(roasterId: string, coffeeId: string, title: string) {
    // We want to send a web request to update a coffee
    return this.webReqService.patch(`roaster/${roasterId}/coffee/${coffeeId}`, { title });
  }

  deleteCoffee(roasterId: string, coffeeId: string) {
    return this.webReqService.delete(`roaster/${roasterId}/coffee/${coffeeId}`);
  }

  deleteRoaster(id: string) {
    return this.webReqService.delete(`roaster/${id}`);
  }

  getCoffee(roasterId: string) {
    return this.webReqService.get(`roaster/${roasterId}/coffee`);
  }

  createCoffee(title: string, roasterId: string) {
    // We want to send a web request to create a coffee
    return this.webReqService.post(`roaster/${roasterId}/coffee`, { title });
  }

  complete(coffee: Coffee) {
    return this.webReqService.patch(`roaster/${coffee._roasterId}/coffee/${coffee._id}`, {
      completed: !coffee.completed
    });
  }
}
