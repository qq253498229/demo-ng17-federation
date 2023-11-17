// =======防止错误引发浏览器崩溃============
process.on('uncaughtException', (err) => {
  console.error(err)
});
// =======系统窗口============
let win = nw.Window.get();
// 新窗口关闭后释放'win'对象
win.on('closed', function () {
  win = null;
});
// 监听主窗口的`close`事件
nw.Window.get().on('close', function () {
  // 关闭时先进行隐藏以让用户觉得立即关闭
  this.hide();
  global.removeTray()
  // 虽然关了,但实际上它还在工作
  if (win != null)
    win.close(true);

  // 关闭新窗口也关闭主窗口
  this.close(true);
});
// =======系统托盘============
let tray = new nw.Tray({icon: 'tray.png'});
tray.on('click', function () {
  win.show();
})
let menu = new nw.Menu();
menu.append(new nw.MenuItem({
  label: '显示', click: () => {
    win.show();
  }
}));
menu.append(new nw.MenuItem({
  label: '隐藏', click: () => {
    win.hide();
  }
}));
menu.append(new nw.MenuItem({
  label: '控制台', click: () => {
    win.showDevTools()
  }
}));
menu.append(new nw.MenuItem({
  label: '后台控制台', click: () => {
    // =======打开后台的控制台页面============
    chrome.developerPrivate.openDevTools({
      renderViewId: -1,
      renderProcessId: -1,
      extensionId: chrome.runtime.id
    });
  }
}));
menu.append(new nw.MenuItem({
  label: '关闭', click: () => {
    win.hide();
    if (win != null) win.close(true)
  }
}));
tray.menu = menu;
global.removeTray = () => {
  if (tray != null)
    tray.remove();
}
