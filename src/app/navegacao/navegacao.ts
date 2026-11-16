import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription, TimeoutError } from 'rxjs';
import { ModalEntrar } from '../modal-entrar/modal-entrar';
import { ModalCadastro } from '../modal-cadastro/modal-cadastro';
import { AuthService } from '../auth-service';
import { UsuarioService } from '../service/usuario-service';
import { TokenService } from '../service/token-service';
import { Usuario } from '../model/usuario';
import { LoginUsuario } from '../model/login-usuario';
import { mensagemErroApi } from '../utils/http-error-message';
@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ToastModule, ModalEntrar, ModalCadastro],
  templateUrl: './navegacao.html',
  styleUrl: './navegacao.css',
  providers: [MessageService],
})
export class Navegacao implements OnInit, OnDestroy {
  @ViewChild('modalEntrar') modalEntrar!: ModalEntrar;
  @ViewChild('modalCadastro') modalCadastro!: ModalCadastro;
  isAuthenticated = false;
  isAdmin = false;
  menuAberto = false;
  private sub?: Subscription;
  constructor(
    private auth: AuthService,
    private users: UsuarioService,
    private tokens: TokenService,
    private router: Router,
    private messages: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.atualizar();
    this.sub = this.auth.authState$.subscribe(() => this.atualizar());
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  private atualizar(): void {
    this.isAuthenticated = this.auth.isLoggedIn();
    this.isAdmin = this.auth.temAuthority('ADMIN');
    this.cdr.markForCheck();
  }
  entrar(data: { email: string; password: string }): void {
    this.modalEntrar.salvando = true;
    this.modalEntrar.erro = '';
    this.users.loginPeloModal(new LoginUsuario(data.email, data.password)).subscribe({
      next: (res: any) => {
        if (!res?.accessToken || !res?.refreshToken) {
          this.modalEntrar.erro = 'O servidor não retornou os dados de acesso.';
          this.modalEntrar.salvando = false;
          this.cdr.detectChanges();
          return;
        }
        this.tokens.setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
        this.auth.notificarLogin();
        this.modalEntrar.closeAfterSubmit();
        this.atualizar();
        this.messages.add({
          severity: 'success',
          summary: 'Bem-vindo',
          detail: 'Login realizado com sucesso.',
        });
        this.modalEntrar.salvando = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.modalEntrar.erro =
          e instanceof TimeoutError
            ? 'O servidor demorou para responder. Verifique a conexão e tente novamente.'
            : mensagemErroApi(e, 'Não foi possível entrar. Verifique seu e-mail e senha.');
        this.modalEntrar.salvando = false;
        this.cdr.detectChanges();
      },
    });
  }
  cadastrar(data: { name: string; email: string; password: string }): void {
    this.modalCadastro.salvando = true;
    this.modalCadastro.erro = '';
    this.users
      .createUsuario(new Usuario(data.name, data.email, data.password, ['USER']))
      .subscribe({
        next: () => {
          this.modalCadastro.closeAfterSubmit();
          this.messages.add({
            severity: 'success',
            summary: 'Cadastro enviado',
            detail: 'Aguarde a aprovação do administrador.',
          });
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.modalCadastro.erro = mensagemErroApi(e, 'Não foi possível criar a conta.');
          this.modalCadastro.salvando = false;
          this.cdr.detectChanges();
        },
      });
  }
  sair(): void {
    this.tokens.clearTokens();
    this.auth.notificarLogout();
    this.atualizar();
    this.router.navigateByUrl('/home');
  }
}
