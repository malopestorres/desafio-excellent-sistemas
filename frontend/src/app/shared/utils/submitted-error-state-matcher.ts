import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl } from '@angular/forms';

export class SubmittedErrorStateMatcher implements ErrorStateMatcher {
  submitted = false;

  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && this.submitted);
  }
}
