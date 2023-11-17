import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/src/lib/shared/shared.module';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PluginSelector } from '../store/plugin.selector';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-plugin-modal',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
      <div>
          <form nz-form [formGroup]="validateForm" ngxsForm="plugin.modal">
              <nz-form-item>
                  <nz-form-label [nzSpan]="7" nzRequired>路径</nz-form-label>
                  <nz-form-control [nzSpan]="12" nzHasFeedback nzValidatingTip="校验中..." [nzErrorTip]="pathErrorTpl">
                      <input nz-input formControlName="path" placeholder="请输入路径"/>
                      <ng-template #pathErrorTpl let-control>
                          <ng-container *ngIf="control.hasError('required')">请输入路径!</ng-container>
                          <ng-container *ngIf="control.hasError('duplicated')">路径重复!</ng-container>
                      </ng-template>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSpan]="7">描述</nz-form-label>
                  <nz-form-control [nzSpan]="12" nzHasFeedback>
                      <nz-textarea-count [nzMaxCharacterCount]="2000">
                          <textarea formControlName="desc" nz-input rows="2" placeholder="请输入描述"></textarea>
                      </nz-textarea-count>
                  </nz-form-control>
              </nz-form-item>
          </form>
      </div>

  `,
  styles: ``,
})
export class PluginModalComponent {
  validateForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private store: Store,
      private ref: NzModalRef,
  ) {
    this.validateForm = this.fb.group({
      path: ['', [Validators.required], [this.pathAsyncValidator]],
      desc: [''],
      exposedModule: [''],
      moduleName: [''],
      remoteEntry: [''],
      remoteEntryDev: [''],
      menu: [],
    });
  }

  ngOnInit() {
    this.store.select(PluginSelector.modalFlag).subscribe(r => {
      if (!r) this.ref.destroy();
    });
  }

  pathAsyncValidator: AsyncValidatorFn = (control: AbstractControl) => new Observable((observer: Observer<ValidationErrors | null>) => {
    let valid = this.store.selectSnapshot(PluginSelector.checkCustomPluginPath(control.value));
    observer.next(valid ? null : {error: true, duplicated: true});
    observer.complete();
  });
}
