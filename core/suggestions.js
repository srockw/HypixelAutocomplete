import { GamemodeArgumentType, HousingStatActionArgumentType, HousingThemeArgumentType, LanguageArgumentType, PlayerArgumentType, SkyblockItemArgumentType, SkyblockRecipeArgumentType } from "./customtypes";
import { literal, argument, overrideHypixelCommand } from "./node";
import { createGenericArrayType, getData } from "./utils";

const completions = getData("completions");
const aliases = getData("aliases");
const suggestions = {};

function parseDataObject(object) {
  let node;

  if (object.literal) {
    node = literal(object.literal);
  }
  else if (object.argument) {
    let type;

    switch (object.type) {
      case "integer":
        type = Commands.integer(
          object.min ?? java.lang.Integer.MIN_VALUE,
          object.max ?? java.lang.Integer.MAX_VALUE,
        );
        break;
      case "long":
        type = Commands.long(
          object.min ?? java.lang.Long.MIN_VALUE,
          object.max ?? java.lang.Long.MAX_VALUE
        );
        break;
      case "choices":
        type = createGenericArrayType(object.choices);
        break;
      case "string":
        type = Commands.greedyString();
        break;
      case "player":
        type = PlayerArgumentType;
        break;
      case "time":
        type = Commands.time();
        break;
      case "word":
        type = Commands.word();
        break;
      case "skyblock-recipe":
        type = SkyblockRecipeArgumentType;
        break;
      case "skyblock-item":
        type = SkyblockItemArgumentType;
        break;
      case "housing-theme":
        type = HousingThemeArgumentType;
        break;
      case "gamemode":
        type = GamemodeArgumentType;
        break;
      case "housing-stat-action":
        type = HousingStatActionArgumentType;
        break;
      case "language":
        type = LanguageArgumentType;
        break;
    }

    node = argument(object.argument, type);
  }

  if (object.then) {
    return node.then(parseDataObject(object.then));
  }

  return node;
}

function parseData(data) {
  return data.map(it => {
    const type = typeof it;

    if (type == "string") return literal(it);
    if (type == "object") return parseDataObject(it)
  });
}

function applySuggestionsFromObject(object) {
  Object.entries(object).forEach(([command, data]) => {
    if (command in aliases) {
      aliases[command].forEach(it => overrideHypixelCommand(it, data));
    }

    overrideHypixelCommand(command, data);
  });
}

function loadSuggestions() {
  Object.entries(completions).forEach(([gamemode, map]) => {
    suggestions[gamemode] = {};

    Object.entries(map).forEach(([command, data]) => {
      suggestions[gamemode][command] = parseData(data).map(it => it.build());
    });
  });
}

export function applySuggestions(gamemode) {
  applySuggestionsFromObject(suggestions.global);

  switch (gamemode) {
    case "HOUSING": return applySuggestionsFromObject(suggestions.housing);
    case "SKYBLOCK": return applySuggestionsFromObject(suggestions.skyblock);
  }
}

loadSuggestions();