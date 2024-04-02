import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall,Breakpoints.Small])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    isWeb$: Observable<boolean> = this.breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  userIsAuth=false;
  showMenu=true;
  private authListenerSubs: Subscription | undefined;
  constructor(private breakpointObserver: BreakpointObserver) {
  console.log(this.isWeb$);

  }
  
   
  ngOnInit() {
    this.userIsAuth=true;
  }

  ngOnDestroy(){
  }

  onLogout(){
    
  }
}

