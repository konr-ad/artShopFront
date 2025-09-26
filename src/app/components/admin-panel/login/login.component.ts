import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = false;
  showPwd = false;
  error: string | null = null;
  banner: string | null = null;
  private returnUrl = '/admin/dashboard';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // odczytaj powód i miejsce powrotu
    this.route.queryParamMap.subscribe(qp => {
      const reason = qp.get('reason');
      const ru = qp.get('returnUrl');
      if (ru) this.returnUrl = ru;
      if (reason === 'expired') {
        this.banner = 'Sesja wygasła. Zaloguj się ponownie.';
      }
    });

    // jeżeli już zalogowany — przenieś od razu
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
  togglePwd() { this.showPwd = !this.showPwd; }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.value;
    this.loading = true;
    this.error = null;

    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: () => {
        this.loading = false;
        this.error = 'Nieprawidłowe dane logowania';
      },
    });
  }
}
