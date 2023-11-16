import { Selector } from '@ngxs/store';
import { SystemState, SystemStateModel } from './system.state';

export class SystemSelector {
  @Selector([SystemState])
  static messages({messages}: SystemStateModel) {
    return messages;
  }
}
