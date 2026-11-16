import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from './auth-service';
import { Home } from './home/home';
import { AutorizacaoUsuario } from './autorizacao-usuario/autorizacao-usuario';
import { LoggSystem } from './logg-system/logg-system';
import { podeAcessarLogSystem } from './service/log-system.guard';
import { ListaUsuarios } from './lista-usuarios/lista-usuarios';
const autenticado = () => inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/home']);
export const routes: Routes = [
 { path: '', redirectTo: '/home', pathMatch: 'full' },
 { path: 'home', component: Home, title: 'Biblioteca Duartina' },
 { path: 'livros', title: 'Acervo de livros', loadComponent: () => import('./catalogo/livros').then(m => m.Livros) },
 { path: 'autores', title: 'Autores', loadComponent: () => import('./catalogo/autores').then(m => m.Autores) },
 { path: 'leitura-pdf', title: 'Biblioteca em áudio', canActivate: [autenticado], loadComponent: () => import('./pdf-leitor/pdf-leitor').then(m => m.PdfLeitor) },
 { path: 'autorizacao-usuario', component: AutorizacaoUsuario },
 { path: 'usuarios', component: ListaUsuarios, canActivate: [() => inject(AuthService).temAuthority('ADMIN') || inject(Router).createUrlTree(['/home'])] },
 { path: 'log-system', component: LoggSystem, canActivate: [podeAcessarLogSystem] },
 { path: '**', redirectTo: '/home' }
];
