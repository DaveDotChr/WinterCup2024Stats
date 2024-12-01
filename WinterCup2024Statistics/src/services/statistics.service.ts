import { Injectable } from '@angular/core';
import { Athlete } from '../model/Athlete';
import { Ranking } from '../model/Ranking';
import { Route } from '../model/Route';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl: string = "https://api.jsonbin.io/v3/b/";
  private accessKey: string = "$2a$10$SgdQwmBdhGVTGvBmK2jak.ahyBuYSck8l4IQmI1XkpeuM9t/QWAz6";

  constructor() { }

  public async getRankings(): Promise<Ranking[]>{
    let rankings: Ranking[];

    if(localStorage.getItem("rankings") != null){
      console.log("Using cache for rankings");
      return JSON.parse(localStorage.getItem("rankings"));
    }

    let resp = await fetch(this.baseUrl + "674cdb27ad19ca34f8d3c1d7", {
      headers: {
        "X-Access-Key": "$2a$10$SgdQwmBdhGVTGvBmK2jak.ahyBuYSck8l4IQmI1XkpeuM9t/QWAz6"
      }
    });
    rankings = await resp.json() as Ranking[];
    localStorage.setItem("rankings", JSON.stringify(rankings));
    return rankings;
  }

  public async getRouteStats(): Promise<Route[]>{
    let routes: Route[];
    if(localStorage.getItem("routeStats") != null){
      console.log("Using cache for routeStats");
      
      return JSON.parse(localStorage.getItem("routeStats"));
    }
    let resp = await fetch(this.baseUrl + "674c8da4e41b4d34e45de99f", {
      headers: {
        "X-Access-Key": this.accessKey
      }
    });
    routes = (await resp.json()).record.routeStats as Route[];
    localStorage.setItem("routeStats", JSON.stringify(routes));
    return routes;
  }

  public async getAthletes(){
    let athletes: Athlete[] = [];
    if(localStorage.getItem("athletes") != null && localStorage.getItem("athletes") != "undefined"){
      console.log("Using cache for athletes");
      return JSON.parse(localStorage.getItem("athletes"));
    }
    let resp = await fetch(this.baseUrl + "674cbfd5acd3cb34a8b2373b", {
      headers: {
        "X-Access-Key": this.accessKey
      }
    });
    let temp = (await resp.json()).record;
    for(let key in temp){
      let ath = new Athlete();
      ath.athlete_id = key;
      ath.name = temp[key];
      athletes.push(ath);
    }
    localStorage.setItem("athletes", JSON.stringify(athletes));
    return athletes;
  }

  // public saveRouteStats(routes: Route[]){
  //   console.log(JSON.stringify(routes));
    
    
  //   routes.forEach(route => {
  //     route.routeId = Number.parseInt(route.id.toString());
  //     console.log(JSON.stringify(route));
      
  //     fetch(this.baseUrl + "routeStats", {
  //       method: 'POST',
  //       body: JSON.stringify(route)
  //     })
  //   });
  // }

}
