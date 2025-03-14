// Converted into TS

/**
 * Convert regular and boring text into 1337 text.
 *
 * @author Mathias Novas <novasism@gmail.com>, Michael Enger <mike@thelonelycoder.com>
 * @license IDGAF
 */

const characterMap: { [key: string]: string } = {
  a: "4",
  b: "8",
  e: "3",
  g: "6",
  l: "1",
  o: "0",
  s: "5",
  t: "7",
  æ: "43",
  ø: "03",
  å: "44",
}

const convert = function (string: string) {
  var letter: string;
  string = string || "";
  string = string.replace(/cks/g, "x");

  for (letter in characterMap) {
    if (characterMap.hasOwnProperty(letter)) {
      string = string.replace(
        new RegExp(letter, "g"),
        characterMap[letter]
      );
    }
  }

  return string.toUpperCase();
}

const test = function (character: string) {
  var vowel = /^[4I30U]$/i,
    special = /^[!?.,\-]$/i,
    type: string | boolean = false;

  if (vowel.test(character)) {
    type = "vowel";
  } else if (special.test(character)) {
    type = "special";
  }

  return type;
}

export default function (string: string) {
    string = convert(string);
    if ("" === string) {
      return string;
    }

    var last = string[string.length - 1],
      type = test(last),
      result;

    if (type === "special") {
      result = string.substr(0, string.length - 1) + "ZORZ" + last;
    } else if (type === "vowel") {
      result = string + "XOR";
    } else {
      result = string + "ZORZ";
    }

    return result;
};
