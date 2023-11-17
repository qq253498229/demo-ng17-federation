import { Injectable } from '@angular/core';
import { Action, NgxsAfterBootstrap, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { PluginAction } from './plugin.action';
import * as immutable from 'object-path-immutable';
import { tap } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResetForm } from '@ngxs/form-plugin';
import * as _ from 'lodash';
import { PluginService } from '../plugin.service';
import { PluginModalComponent } from '../plugin-modal/plugin-modal.component';

export interface PluginStateModel {
  list: any[],
  loaded: {
    [key: string]: any
  };
  modal?: any,
  modalFlag: boolean
  custom: []
}

@State<PluginStateModel>({
  name: 'plugin',
  defaults: {
    list: [],
    loaded: {},
    custom: [],
    modalFlag: false,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PluginState implements NgxsOnInit, NgxsAfterBootstrap {
  constructor(
      private pluginService: PluginService,
      private modal: NzModalService,
  ) {
  }

  ngxsAfterBootstrap(ctx: StateContext<any>): void {
    let state = ctx.getState();
    if (state.loaded && Object.keys(state.loaded)) {
      for (let key of Object.keys(state.loaded)) {
        let r = _.find(this.pluginService.list, (s: any) => s.path === key);
        if (!!r) ctx.setState(immutable.set(ctx.getState(), ['loaded', key], r));
      }
    }
  }

  /**
   * 初始化插件
   */
  ngxsOnInit(ctx: StateContext<any>): void {
    this.pluginService.loaded = ctx.getState().loaded;
    ctx.patchState({modalFlag: false});
  }

  @Action(PluginAction.LoadList)
  LoadList(ctx: StateContext<PluginStateModel>) {
    return this.pluginService.loadList().pipe(tap((r: any) => {
      ctx.patchState({list: r});
    }));
  }

  @Action(PluginAction.Load)
  Load(ctx: StateContext<PluginStateModel>, {data}: PluginAction.Load) {
    let state = ctx.getState();
    let newState = immutable.set(state, ['loaded', data.path], data);
    ctx.setState(newState);
    this.pluginService.loaded = ctx.getState().loaded;
    return this.pluginService.init();
  }

  @Action(PluginAction.Unload)
  Unload(ctx: StateContext<PluginStateModel>, {data}: PluginAction.Unload) {
    let state = ctx.getState();
    let newState = immutable.del(state, ['loaded', data.path]);
    ctx.setState(newState);
    this.pluginService.loaded = ctx.getState().loaded;
    return this.pluginService.init();
  }

  @Action(PluginAction.ClosePluginModal)
  ClosePluginModal(ctx: StateContext<PluginStateModel>) {
    ctx.patchState({modalFlag: false});
  }

  @Action(PluginAction.OpenPluginModal)
  OpenPluginModal(ctx: StateContext<PluginStateModel>, {data}: PluginAction.OpenPluginModal) {
    return ctx.dispatch(new ResetForm({path: 'plugin.modal'})).pipe(tap(() => {
      ctx.patchState({modalFlag: true});
      let modalRef: any = this.modal.create({
        nzTitle: data ? '编辑' : '创建',
        nzContent: PluginModalComponent,
        nzMaskClosable: false,
        nzFooter: [
          {
            type: 'primary',
            label: '确定',
            disabled: instance => instance ? (instance.validateForm.invalid || !instance.validateForm.dirty) : true,
            onClick: () => ctx.dispatch(new PluginAction.SavePluginModal()),
          },
          {type: 'default', label: '取消', onClick: () => modalRef.triggerCancel()},
        ],
        nzOnCancel: () => ctx.dispatch(new PluginAction.ClosePluginModal()),
      });
    }));
  }

  @Action(PluginAction.SavePluginModal)
  SavePluginModal(ctx: StateContext<PluginStateModel>) {
    let state = ctx.getState();
    if (!state.modal.dirty || state.modal.status !== 'VALID') return;
    let model = state.modal.model;
    model.type = 'custom';
    ctx.setState(immutable.insert(state, ['custom'], model));
    return ctx.dispatch(new PluginAction.ClosePluginModal());
  }
}
