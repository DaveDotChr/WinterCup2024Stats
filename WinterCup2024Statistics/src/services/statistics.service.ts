import { Injectable } from '@angular/core';
import { Ranking } from '../model/Ranking';
import { Route } from '../model/Route';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private baseUrl: String = "http://localhost:3000/";

  constructor() { }

  public async getRankingsMen(): Promise<Ranking[]>{
    
    let resp = await fetch(this.baseUrl + "userRankingsMen");
    
    return await resp.json() as Ranking[];
  }

  public async getRankingsWomen(): Promise<Ranking[]>{
    
    let resp = await fetch(this.baseUrl + "userRankingsWomen");
    
    return await resp.json() as Ranking[];
  }

  public async getRouteStats(): Promise<Route[]>{
    
    let resp = await fetch(this.baseUrl + "routeStats");
    
    return await resp.json() as Route[];
  }

  public saveRouteStats(routes: Route[]){
    console.log(JSON.stringify(routes));
    
    
    routes.forEach(route => {
      route.id = Number.parseInt(route.id.toString());
      console.log(JSON.stringify(route));
      
      fetch(this.baseUrl + "routeStats", {
        method: 'POST',
        body: JSON.stringify(route)
      })
    });
  }

}
