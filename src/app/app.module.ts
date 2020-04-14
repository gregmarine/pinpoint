import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBvgkwMQD2e7VavBGMa9xjtnhcZE5EqDT4'
    }),
    IonicStorageModule.forRoot({ name: 'pinpoint' }),
    BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initMaps,
      deps: [MapsAPILoader],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

function initMaps(mapLoader: MapsAPILoader): () => Promise<void> {
  return () => mapLoader.load();
}