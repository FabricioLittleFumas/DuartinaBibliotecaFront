import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service';
@Component({selector:'app-atalhos-rapidos',standalone:true,imports:[CommonModule,RouterLink],templateUrl:'./atalhos-rapidos.html',styleUrl:'./atalhos-rapidos.css'})
export class AtalhosRapidos implements OnInit,OnDestroy {isAdmin=false;private sub?:Subscription;constructor(private auth:AuthService,private cdr:ChangeDetectorRef){}ngOnInit():void{this.atualizar();this.sub=this.auth.authState$.subscribe(()=>this.atualizar());}ngOnDestroy():void{this.sub?.unsubscribe();}private atualizar():void{this.isAdmin=this.auth.temAuthority('ADMIN');this.cdr.markForCheck();}}
