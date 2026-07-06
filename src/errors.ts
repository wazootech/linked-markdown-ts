/**
 * LinkedMarkdownError is a custom error class for LinkedMarkdown errors.
 */
export class LinkedMarkdownError extends Error {
  readonly code: string;
  override readonly cause?: Error;

  constructor(code: string, message?: string, cause?: Error) {
    super(message ?? code);
    this.name = "LinkedMarkdownError";
    this.code = code;
    this.cause = cause;
  }
}

/**
 * LMD_NO_FRONTMATTER is an error code indicating that the LinkedMarkdown
 * content does not contain frontmatter.
 */
export const LMD_NO_FRONTMATTER = "LMD_NO_FRONTMATTER";

/**
 * LMD_INVALID_FRONTMATTER is an error code indicating that the frontmatter in
 * the LinkedMarkdown content is invalid.
 */
export const LMD_INVALID_FRONTMATTER = "LMD_INVALID_FRONTMATTER";
