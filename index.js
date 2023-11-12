import { SupportedTypesArgumentType } from "./core/customtypes";
import { applySuggestions } from "./core/suggestions";

const ScoreboardObjectiveUpdatePacket = Java.type("net.minecraft.network.packet.s2c.play.ScoreboardObjectiveUpdateS2CPacket")

let currentGamemode = null;

register("serverDisconnect", () => currentGamemode = null);
register("worldLoad", () => currentGamemode = null);

register("packetReceived", packet => {
  if (Server.getIP().endsWith("hypixel.net")) {
    const gamemode = packet.getDisplayName().getString().toUpperCase().replaceAll(" ", "_");

    if (gamemode != null && gamemode.length > 0 && currentGamemode != gamemode) {
      currentGamemode = gamemode;

      setTimeout(() => {
        applySuggestions(gamemode);
      }, 500);
    }
  }
}).setFilteredClass(ScoreboardObjectiveUpdatePacket.class);

Commands.registerCommand("hypixelautocomplete", () => {
  const { literal, argument, exec } = Commands;

  literal("apply", () => {
    argument("type", SupportedTypesArgumentType, () => {
      exec(({ type }) => {
        applySuggestions(type.toUpperCase());
        ChatLib.chat(`&e[HypixelAutocomplete] &fApplied &b"${type}" &fsuggestions!`);
      });
    });
  });
});