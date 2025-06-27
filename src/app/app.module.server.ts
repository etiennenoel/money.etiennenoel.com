import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';
import {IndexPage} from './pages/index/index.page';
import {RootComponent} from '@magieno/angular-core';

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [provideServerRoutesConfig(serverRoutes)],
  bootstrap: [RootComponent],
})
export class AppServerModule {}
