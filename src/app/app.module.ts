import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {BaseComponent} from './components/base/base.component';
import {BasePageComponent} from './components/base/base-page.component';
import {LayoutComponent} from './components/layout/layout.component';
import {RootComponent} from './components/root/root.component';
import {IndexComponent} from './pages/index/index.component';
import {ToastComponent} from './components/toast/toast.component';
import {ToastStore} from './stores/toast.store';

@NgModule({
  declarations: [
    LayoutComponent,
    RootComponent,

    ToastComponent,

    // Pages
    IndexComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),

    ToastStore,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
