import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { map, Observable, startWith } from 'rxjs';
import { Athlete } from '../model/Athlete';
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

  openDialog(route): void {    
    const dialogRef = this.dialog.open(ComparisonDialog, {
      data: route
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}

@Component({
  selector: 'comparison-dialog',
  templateUrl: './comparison-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
})
export class ComparisonDialog implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ComparisonDialog>);
  readonly data = inject<Route>(MAT_DIALOG_DATA);
  statsService = inject(StatisticsService);
  myControl = new FormControl('');
  athletesList: Athlete[];
  filteredAthletes: Observable<Athlete[]>;
  comparisonAthlete: Athlete;

  constructor(){
    this.getAthletes();
    this.comparisonAthlete = this.statsService.comparisonAthlete;
    console.log(this.comparisonAthlete);
    
  }
  

  ngOnInit() {
    this.filteredAthletes = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): Athlete[] {
    const filterValue = value.toLowerCase();

    return this.athletesList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  async getAthletes(){
    this.athletesList = await this.statsService.getAthletes();
  }

  optionSelected(option: MatAutocompleteSelectedEvent){    
    this.statsService.comparisonAthlete = this.athletesList.filter(athlete => athlete.name === option.option.value)[0];
    this.comparisonAthlete = this.statsService.comparisonAthlete;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}