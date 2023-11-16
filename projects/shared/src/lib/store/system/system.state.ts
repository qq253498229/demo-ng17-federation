import { Injectable } from '@angular/core';
import { Action, NgxsAfterBootstrap, State, StateContext } from '@ngxs/store';
import { SystemAction } from './system.action';
import * as immutable from 'object-path-immutable';
import { uuid } from '../../utils/utils';

export interface SystemStateModel {
  messages: {
    [id: string]: {
      key: string,
      data: any
    }
  };
}

@State<SystemStateModel>({
  name: 'system',
  defaults: {
    messages: {},
  },
})
@Injectable({
  providedIn: 'root',
})
export class SystemState implements NgxsAfterBootstrap {

  constructor() {
  }

  ngxsAfterBootstrap(ctx: StateContext<any>): void {
    if (!ctx.getState().messages) ctx.patchState({messages: {}});
  }

  @Action(SystemAction.SendMessage)
  SendMessage(ctx: StateContext<SystemStateModel>, {key, data}: SystemAction.SendMessage) {
    ctx.setState(immutable.set(ctx.getState(), ['messages', uuid()], {key, data}));
  }
}
