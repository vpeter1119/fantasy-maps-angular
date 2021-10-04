import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = true;
  isAuth = false;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
  }

  onSubmit(formData) {
    this.isLoading = true;
    this.authService.login(formData.value.username, formData.value.password)
      .then((authStatus: boolean) => {
        this.isAuth = authStatus;
        this.dialogRef.close();
      });
  }

}
