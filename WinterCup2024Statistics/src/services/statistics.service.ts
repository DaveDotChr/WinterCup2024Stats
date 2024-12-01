import { Injectable } from '@angular/core';
import { Ranking } from '../model/Ranking';
import { Route } from '../model/Route';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  //Ja es juckt mich nicht dass der hier sichtbar ist, ist eh ein free account und hat nur read rechte :)
  apiKey = "$2a$10$SgdQwmBdhGVTGvBmK2jak.ahyBuYSck8l4IQmI1XkpeuM9t/QWAz6";

  private baseUrl: String = "https://api.jsonbin.io/v3/b/";
  // private baseUrl: String = "http://localhost:3000/";

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
    
    // let resp = await fetch(this.baseUrl + "routeStats");
    let resp = await fetch(this.baseUrl + "674c8da4e41b4d34e45de99f", {
      headers: {
        "X-Access-Key": this.apiKey
      }
    });
    return (await resp.json()).record.routeStats as Route[];
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
