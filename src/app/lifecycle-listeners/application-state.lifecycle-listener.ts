import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ApplicationStateService, LifecycleListenerInterface} from '@magieno/angular-core';
import {ApplicationStateParameterEnum} from '../enums/application-state-parameter.enum';
import {PrimitiveType} from '@pristine-ts/data-mapping-common';
import {isPlatformServer} from '@angular/common';

@Injectable()
export class ApplicationStateLifecycleListener implements LifecycleListenerInterface {

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly applicationState: ApplicationStateService,
  ) {
  }

  onFirstLoad(): void {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    // Register all the states here
    this.applicationState.registerState({
      name: ApplicationStateParameterEnum.DebugPanelCollapsedImportStatement,
      type: PrimitiveType.Boolean,
      defaultValue: true,
      storeInQueryString: false,
      storeInLocalStorage: true,
    })
  }

}
