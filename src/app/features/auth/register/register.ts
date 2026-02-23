import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../../core/services/auth';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  protected readonly roles = [
    { label: 'Responsable Pédagogique', value: UserRole.RP },
    /**{ label: 'Professeur', value: UserRole.PROF },**/
    { label: 'Attaché', value: UserRole.ATTACHE },
    /**{ label: 'Étudiant', value: UserRole.ETUDIANT }**/
  ];

  registerForm = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [UserRole.ETUDIANT as UserRole, [Validators.required]],
    adresse: ['']
  });

  constructor() {
    this.registerForm.controls.role.valueChanges.subscribe((role) => {
      const adresseCtrl = this.registerForm.controls.adresse;

      if (role === UserRole.ETUDIANT) {
        adresseCtrl.setValidators([Validators.required]);
      } else {
        adresseCtrl.clearValidators();
        adresseCtrl.setValue('');
      }

      adresseCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = this.registerForm.getRawValue();
    this.authService.register(payload).subscribe({
      next: () => {
        this.snackBar.open('Compte créé avec succès. Connectez-vous.', 'Fermer', { duration: 3500 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Erreur lors de la création du compte', 'Fermer', {
          duration: 5000
        });
      }
    });
  }
}
