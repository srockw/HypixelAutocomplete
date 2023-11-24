import { createGenericArrayType, getData, suggestionsFromArray } from "./utils";

const SkyblockRecipes = getData("skyblock-recipes");
const SkyblockItems = getData("skyblock-items");
const HousingThemes = getData("housing-themes");
const Gamemodes = getData("gamemodes");
const Languages = getData("languages");
const HousingGameRules = getData("housing-game-rules");

export const SkyblockRecipeArgumentType = createGenericArrayType(SkyblockRecipes);
export const SkyblockItemArgumentType = createGenericArrayType(SkyblockItems);
export const HousingThemeArgumentType = createGenericArrayType(HousingThemes);
export const GamemodeArgumentType = createGenericArrayType(Gamemodes);
export const LanguageArgumentType = createGenericArrayType(Languages);
export const HousingGameRuleArgumentType = createGenericArrayType(HousingGameRules);
export const HousingStatActionArgumentType = createGenericArrayType(["inc", "dec", "set", "multiply", "divide"]);
export const SupportedTypesArgumentType = createGenericArrayType(["global", "housing", "skyblock"]);

export const PlayerArgumentType = Commands.custom({
  parse(reader) {
    const string = reader.readUnquotedString();

    if (string.length > 16) {
      Commands.error(reader, "Player names cannot be longer than 16 characters!");
    }

    return string;
  },

  suggest(ctx, builder) {
    const names = TabList.getUnformattedNames();

    if (names) {
      return suggestionsFromArray(names, builder);
    }

    return builder.buildFuture();
  }
});