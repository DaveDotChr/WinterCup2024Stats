import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Route } from '../model/Route';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatTableModule, MatSortModule, MatSelectModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WinterCup2024Statistics';
  routes: Route[];
  dataSource;
  statsService = inject(StatisticsService);
  displayedColumns = ['id', 'difficulty', 'numFlash', 'numTop', 'numAttempts'];
  tabIndex = 0;

  private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChildren(MatSort) sorts: QueryList<MatSort>;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor() {
    // this.statsService.getAthletes();
    this.statsService.getRouteStats().then(async (routes) => {      
      this.routes = routes;
      this.dataSource = new MatTableDataSource(routes);
      
      this.sorts.changes.subscribe((change: QueryList<MatSort>) => {
        this.dataSource.sort = change.first;
      })
    });

  }

  

  swapColumns(event: MatTabChangeEvent){
    switch (event.index){
      case 0: 
        this.displayedColumns = ['id', 'difficulty', 'numFlash', 'numTop', 'numAttempts'];
        break;
      case 1:
        this.displayedColumns = ['id', 'difficulty', 'numFlashWomen', 'numTopWomen', 'numAttemptsWomen'];
        break;
      case 2:
        this.displayedColumns = ['id', 'difficulty', 'numFlashMen', 'numTopMen', 'numAttemptsMen'];
        break;
    
    }
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // private readStats(rankings: Ranking[], men_women: number) {
  //   rankings.forEach((ranking) => {
  //     ranking.ascents.forEach(ascent => {
  //       let route = this.routes.find(route => route.routeId == Number.parseInt(ascent.route_name));
  //       route.numAttempts += ascent.top ? ascent.top_tries : 0;
  //       route.numTop += ascent.top ? 1 : 0;
  //       route.numFlash += (ascent.top && ascent.top_tries == 1) ? 1 : 0;
  //       if (men_women === 0) {
  //         route.numAttemptsMen += ascent.top ? ascent.top_tries : 0;
  //         route.numTopMen += ascent.top ? 1 : 0
  //         route.numFlashMen += (ascent.top && ascent.top_tries == 1) ? 1 : 0;
  //       } else {
  //         route.numAttemptsWomen += ascent.top ? ascent.top_tries : 0;
  //         route.numTopWomen += ascent.top ? 1 : 0
  //         route.numFlashWomen += (ascent.top && ascent.top_tries == 1) ? 1 : 0;
  //       }
  //     })
  //   })
  // }

}
