import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }
  showAlert() {
    const email = (document.getElementById('form1Example13') as HTMLInputElement).value;
    const password = (document.getElementById('form1Example23') as HTMLInputElement).value;
    
    if (email === 'admin' && password === 'admin') {
      this.router.navigate(['/mapa']);
    } else {
      // Utiliza SweetAlert para mostrar un mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Credenciales incorrectas',
      });
    }
  }
}