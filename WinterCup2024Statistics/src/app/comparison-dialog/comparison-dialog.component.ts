import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Athlete } from '../../model/Athlete';
import { Difficulty } from '../../model/Difficulty';
import { Route } from '../../model/Route';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-comparison-dialog',
  imports: [FormsModule, MatDialogActions, MatDialogTitle, DecimalPipe, MatAutocompleteModule, AsyncPipe, MatInputModule, DialogModule, MatDialogContent, ReactiveFormsModule, MatButtonModule],
  templateUrl: './comparison-dialog.component.html',
  styleUrl: './comparison-dialog.component.scss',
  standalone: true
})
export class ComparisonDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ComparisonDialogComponent>);
  readonly data: Route = inject<Route>(MAT_DIALOG_DATA);
  statsService = inject(StatisticsService);
  myControl = new FormControl('');
  athletesList: Athlete[];
  filteredAthletes: Observable<Athlete[]>;
  comparisonAthlete: Athlete;
  schwierigkeitString: string;



  constructor() {
    this.getAthletes();
    this.comparisonAthlete = this.statsService.comparisonAthlete;
    console.log(this.comparisonAthlete);

  }


  ngOnInit() {
    this.filteredAthletes = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.schwierigkeitString = Difficulty[this.data.difficulty - 1];
    let val;
    if ((val = localStorage.getItem("quickCompareAthlete")) != null) {
      this.comparisonAthlete = JSON.parse(val);
    }

    let routes: Route[] = JSON.parse(localStorage.getItem("routeStats"));

  }

  private _filter(value: string): Athlete[] {
    const filterValue = value.toLowerCase();

    return this.athletesList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  async getAthletes() {
    this.athletesList = await this.statsService.getAthletes();
  }

  optionSelected(option: MatAutocompleteSelectedEvent) {
    this.statsService.comparisonAthlete = this.athletesList.filter(athlete => athlete.name === option.option.value)[0];
    this.comparisonAthlete = this.statsService.comparisonAthlete;
    localStorage.setItem("quickCompareAthlete", JSON.stringify(this.comparisonAthlete));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clearAthlete() {
    localStorage.removeItem("quickCompareAthlete");
    this.comparisonAthlete = null;
  }
}
