Hooks.on("createChatMessage", (message, option, user) => {
  let hasInlineRoll = message.data.content.indexOf("inline-roll") !== -1;
  if (!message.isRoll && !hasInlineRoll) return;

  let roll = {};
  if (game.modules.get("betterrolls5e") &&game.modules.get("betterrolls5e").active) roll = message.data.flags.betterrolls5e.entries.filter((t) => t.type === "multiroll")[0].entries[0].roll;
  else roll = message.roll;
  
  let timestamp = message.data.timestamp;
  let username = message.user.data.name;
  let actorname = message.alias;
  let roll_result = roll.result;
  let roll_formula = roll.formula;

  let res = {
    type: "roll",
    timestamp: timestamp,
    roll: {
      username: username,
      actorname: actorname,
      roll_result: roll_result,
      roll_formula: roll_formula,
    },
    style: game.settings.get("streamoverlay", "cssEditor"),
    html: game.settings.get("streamoverlay", "htmlEditor"),
  };
  game.socket.emit("module.streamoverlay", res);
  console.log(res);
});