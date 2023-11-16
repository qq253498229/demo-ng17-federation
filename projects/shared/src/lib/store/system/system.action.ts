export namespace SystemAction {
  export class SendMessage {
    static readonly type = `[system]发送消息`;

    constructor(public key: string, public data: any) {
    }
  }
}
