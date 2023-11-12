export function suggestionsFromArray(array, builder) {
  const input = builder.getRemainingLowerCase()

  let suggestions = array.filter(it => it.toLowerCase().startsWith(input));

  if (suggestions.length < 1) {
    suggestions = array.filter(it => it.toLowerCase().includes(input));
  }

  if (suggestions.length < 1) {
    suggestions = array.filter(it => {
      let chars = input.split("");
      return chars.every(char => it.toLowerCase().includes(char));
    });
  }

  suggestions.forEach(it => builder.suggest(it));

  return builder.buildFuture();
}

export function createGenericArrayType(array) {
  return Commands.custom({
    parse(reader) {
      const string = reader.readUnquotedString();

      if (array.every(it => it.toLowerCase() != string.toLowerCase())) {
        Commands.error(reader, `'${string}' is not a valid value for this argument!`);
      }

      return string;
    },

    suggest(ctx, builder) {
      return suggestionsFromArray(array, builder);
    }
  });
}

export function getData(name) {
  return JSON.parse(FileLib.read("HypixelAutocomplete", `data/${name}.json`));
}
