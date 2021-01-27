import { parsers } from "prettier/parser-markdown";
import * as prettier from "prettier";

// Return the content before the first thematic break (https://github.github.com/gfm/#thematic-breaks).
// We don't use a regex because text such as `---` could also be found in Markdown code blocks
// but they shouldn't be considered as thematic breaks there.
// The simplest is to use a good Markdown parser such as the one used by Prettier.
const filterBody = (body: string): string => {
  let trimmedBody = body.trim();
  // @ts-ignore
  const { children } = parsers.markdown.parse(trimmedBody);
  const firstThematicBreak = children.find(
    ({ type }: { type: string }) => type === "thematicBreak",
  );
  trimmedBody = firstThematicBreak === undefined
    ? trimmedBody
    : trimmedBody.slice(0, firstThematicBreak.position.start.offset).trim();

  return prettier.format(trimmedBody, {
    parser: "markdown",
    // The formatted body will be used for commit messages, so it should be hard wrapped.
    proseWrap: "always"
  })
};

export { filterBody };
