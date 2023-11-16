import { Selector } from '@ngxs/store';
import { RouterState, RouterStateModel } from '@ngxs/router-plugin';
import { RouterStateParams } from './custom-router-state-serializer';

export class RouterSelector {
  @Selector([RouterState])
  static url({state}: RouterStateModel<RouterStateParams>) {
    return state?.url;
  }

  @Selector([RouterState])
  static params({state}: RouterStateModel<RouterStateParams>) {
    return state?.params;
  }

  @Selector([RouterState])
  static queryParams({state}: RouterStateModel<RouterStateParams>) {
    return state?.queryParams;
  }
}
