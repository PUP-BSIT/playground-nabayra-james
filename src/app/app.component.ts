import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CountryService } from '../service/country.service';
import { switchMap, debounceTime, filter, catchError, EMPTY, retry } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showSidebar = false;
  searchForm: FormGroup;
  isLoading = false;
  
  constructor (private fb: FormBuilder, countryService: CountryService, private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({ keyword: [''] });
    this.searchForm
      .get('keyword')!
      .valueChanges.pipe(
        takeUntilDestroyed(),
        filter((keyword) => keyword.length > 3),
        debounceTime(2000),
        switchMap((keyword) => {
          this.isLoading = true;
          return countryService.getCountryByName(keyword).pipe(
              retry(3),
              catchError((error: HttpErrorResponse) => {
              this.isLoading = false;
              console.error(error);
              this.snackBar.open(error.message, 'Close');
              return EMPTY;
              })
          );
        })
      )
      .subscribe({
        next: (value) => {
          this.isLoading = false;
          console.log(value);
      },
        error: (error) => {
          this.isLoading = false;
          console.error(error);
      },
    });
  }
}