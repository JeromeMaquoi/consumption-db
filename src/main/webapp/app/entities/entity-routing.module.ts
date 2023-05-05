import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'software',
        data: { pageTitle: 'consumptionDbApp.consumptionDbSoftware.home.title' },
        loadChildren: () => import('./consumptionDb/software/software.module').then(m => m.ConsumptionDbSoftwareModule),
      },
      {
        path: 'release',
        data: { pageTitle: 'consumptionDbApp.consumptionDbRelease.home.title' },
        loadChildren: () => import('./consumptionDb/release/release.module').then(m => m.ConsumptionDbReleaseModule),
      },
      {
        path: 'method',
        data: { pageTitle: 'consumptionDbApp.consumptionDbMethod.home.title' },
        loadChildren: () => import('./consumptionDb/method/method.module').then(m => m.ConsumptionDbMethodModule),
      },
      {
        path: 'consumption',
        data: { pageTitle: 'consumptionDbApp.consumptionDbConsumption.home.title' },
        loadChildren: () => import('./consumptionDb/consumption/consumption.module').then(m => m.ConsumptionDbConsumptionModule),
      },
      {
        path: 'measure',
        data: { pageTitle: 'consumptionDbApp.consumptionDbMeasure.home.title' },
        loadChildren: () => import('./consumptionDb/measure/measure.module').then(m => m.ConsumptionDbMeasureModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
