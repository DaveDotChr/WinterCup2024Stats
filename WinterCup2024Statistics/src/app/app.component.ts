import { Component, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Route } from '../model/Route';
import { StatisticsService } from '../services/statistics.service';
import { ComparisonDialogComponent } from './comparison-dialog/comparison-dialog.component';


@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatTableModule, MatSortModule, MatSelectModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'WinterCup2024Statistics';
  routes: Route[];
  dataSource;
  statsService = inject(StatisticsService);
  displayedColumns = ['id', 'difficulty', 'numFlash', 'numTop', 'numAttempts'];
  tabIndex = 0;
  readonly dialog = inject(MatDialog);

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

  swapColumns(event: MatTabChangeEvent) {
    switch (event.index) {
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

  openDialog(route): void {
    const dialogRef = this.dialog.open(ComparisonDialogComponent, {
      data: route
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
