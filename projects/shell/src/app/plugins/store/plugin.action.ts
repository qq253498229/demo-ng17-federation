export namespace PluginAction {
  export class LoadList {
    static readonly type = `加载列表`;
  }

  export class Load {
    static readonly type = `加载插件`;

    constructor(public data: any) {
    }
  }

  export class Unload {
    static readonly type = `卸载插件`;

    constructor(public data: any) {
    }
  }

  export class OpenPluginModal {
    static readonly type = `打开插件对话框`;

    constructor(public data?: any) {
    }
  }

  export class ClosePluginModal {
    static readonly type = `关闭插件对话框`;
  }

  export class SavePluginModal {
    static readonly type = `插件对话框提交`;
  }
}
