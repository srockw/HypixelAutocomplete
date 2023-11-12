const MCCommandManager = Java.type("net.minecraft.server.command.CommandManager");

function getRootNode() {
  return Player.toMC().networkHandler.getCommandDispatcher().getRoot();
}

export function literal(name) {
  return MCCommandManager.literal(name);
}

export function argument(name, type) {
  return MCCommandManager.argument(name, type);
}

export function overrideHypixelCommand(name, children) {
  const root = getRootNode();
  const node = root.getChild(name);

  if (node) {
    root.childNodes.remove(name);
  }

  const newNode = literal(name);
  children.forEach(it => newNode.then(it));
  
  root.addChild(newNode.build());
}
