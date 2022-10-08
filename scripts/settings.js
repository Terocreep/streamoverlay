// used variable
let so_waitingRoll = false

Hooks.once("init", function () {
  const namespace = "streamoverlay";
  game.socket.on("any", console.log);
  game.settings.registerMenu(namespace, "customEditor", {
    name: game.i18n.localize(`${namespace}.settings.customEditor.name`),
    label: game.i18n.localize(`${namespace}.settings.customEditor.label`),
    hint: game.i18n.localize(`${namespace}.settings.customEditor.hint`),
    icon: "far fa-file-code",
    type: so_CustomEditor,
    restricted: true,
  });
  game.settings.register(namespace, "htmlEditor", {
    scope: "world",
    config: false,
    type: String,
    default:
      '<div class="notif">\n  <div class="notif-header">{username}</div>\n  <div class="notif-content">{roll_result}</div>\n</div>',
  });
  game.settings.register(namespace, "cssEditor", {
    scope: "world",
    config: false,
    type: String,
    default: "",
  });

  game.settings.registerMenu(namespace, "linkGenerator", {
    name: game.i18n.localize(`${namespace}.settings.linkGenerator.name`),
    label: game.i18n.localize(`${namespace}.settings.linkGenerator.label`),
    hint: game.i18n.localize(`${namespace}.settings.linkGenerator.hint`),
    icon: "far fa-file-code",
    type: so_LinkGenerator,
    restricted: true,
  });
});

/**
 * @description settings window that includes 2 ace editors
 *
 * @class CustomEditor
 * @extends {FormApplication}
 */
class so_CustomEditor extends FormApplication {
  constructor(object = {}, options = {}) {
    super(object, options);
    this.editorArray = {};
    this.unsaved = false;
    this.sendToSettings = this.sendToSettings.bind(this);
  }
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "custom-editor",
      title: game.i18n.localize("streamoverlay.windows.CustomEditor.title"),
      template: "modules/streamoverlay/templates/customEditor.html",
      classes: ["sheet"],
      closeOnSubmit: true,
      resizable: true,
      width: 602,
      height: 600,
    });
  }
  /** @param {JQuery} html */
  activateListeners(html) {
    super.activateListeners(html);
    this.initEditorHtml();
    html.find("button.save-button").on("click", () => {this.sendToSettings();});
  }
  /**
   * @description checks if already saved on close
   *
   * @override
   * @private
   */
  _getHeaderButtons() {
    return [
      {
        label: game.i18n.localize("Close"),
        class: "close",
        icon: "fas fa-times",
        onclick: (_ev) => {
          if (this.unsaved) {
            Dialog.confirm({
              title: game.i18n.localize("streamoverlay.global.saveDialog.title"),
              content: `<p>${game.i18n.localize("streamoverlay.global.saveDialog.content")}</p>`,
              yes: () => {
                $("#custom-editor button.save-button").trigger("click");
                setTimeout(() => {this.close();}, 50);
              },
              no: () => this.close(),
              defaultYes: false,
            });
          } else {this.close();}
        },
      },
    ];
  }
  initEditorHtml() {
    this.createEditor("cssEditor", "ace/mode/css");
    this.createEditor("htmlEditor", "ace/mode/html");
  }
  sendToSettings() {
    game.settings.set(
      "streamoverlay",
      "cssEditor",
      this.editorArray["cssEditor"].getValue()
    );
    game.settings.set(
      "streamoverlay",
      "htmlEditor",
      this.editorArray["htmlEditor"].getValue()
    );
    ui.notifications.notify(game.i18n.localize("streamoverlay.global.saved"));
    this.unsaved = false;
  }
  createEditor(name, mode) {
    this.editorArray[name] = ace.edit(name);
    this.editorArray[name].setOptions(
      mergeObject(ace.userSettings, {mode: mode,})
    );
    this.editorArray[name].setValue(game.settings.get("streamoverlay", name),-1);
    this.editorArray[name].commands.addCommand({
      name: "Save",
      bindKey: { win: "Ctrl-S", mac: "Command-S" },
      exec: this.sendToSettings,
    });
    this.editorArray[name].getSession().on("change", () => {if (!this.unsaved) this.unsaved = true;});
    new ResizeObserver(() => {
      this.editorArray[name].resize();
      this.editorArray[name].renderer.updateFull();
    }).observe(this.editorArray[name].container);
  }
}

/**
 * @description settings window that includes 2 ace editors
 *
 * @class LinkGenerator
 * @extends {Application}
 */
class so_LinkGenerator extends FormApplication {
  constructor(object = {}, options = {}) {
    super(object, options);
    this.editorArray = {};
    this.actors = this.setupActorList();
    this.users = this.setupUserList();
  }
  initEditorHtml() {
    this.createEditor("cssEditor", "ace/mode/css");
    this.createEditor("htmlEditor", "ace/mode/html");
  }
  createEditor(name, mode) {
    this.editorArray[name] = ace.edit(name);
    this.editorArray[name].setOptions(mergeObject(ace.userSettings, {mode: mode,}));
    new ResizeObserver(() => {
      this.editorArray[name].resize();
      this.editorArray[name].renderer.updateFull();
    }).observe(this.editorArray[name].container);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "link-generator",
      title: game.i18n.localize("streamoverlay.windows.LinkGenerator.title"),
      template: "modules/streamoverlay/templates/linkGenerator.html",
      classes: ["sheet"],
      closeOnSubmit: true,
      resizable: true,
      width: 1000,
      height: 800,
    });
  }
  /** @param {JQuery} html */
  activateListeners(html) {
    super.activateListeners(html);

    // inserts ace editors into html
    this.initEditorHtml();

    function so_changeDisplay($el) {
      if ($el.classList.contains("so_is-hidden")) $el.classList.remove("so_is-hidden");
      else $el.classList.add("so_is-hidden");
    }

    // Add a click event on buttons to extend the list
    (document.querySelectorAll(".so_collapsible") || []).forEach(($trigger) => {
      const list = $trigger.dataset.target;
      const $target = document.getElementById(list);
      $trigger.addEventListener("click", () => {so_changeDisplay($target);});
    });
  }
  getData(options) {
    const data = super.getData(options);
    data.actors = this.actors;
    data.users = this.users;
    return data;
  }
  setupActorList() {
    let actors = [];
    game.actors.forEach((actor) => {actors.push({ name: actor.name, id: actor.id });});
    return actors;
  }
  setupUserList() {
    let users = [];
    game.users.forEach((user) => {users.push({ name: user.name, id: user.id });});
    return users;
  }
}
