import { LogicErrorException, validateIndex } from "./LogosUtils";

/**
 * Exception used to singal and describe an error that
 * occurred during parser, due to failing to parse a
 * malformed sentence.
 *
 * The core functionality of this exception is that
 * it gathers information about string character indexes
 * where the error was found.
 *
 * It carries a message that is suited for the CLI.
 */
export class ParsingException extends Error 
{
  /**
   * Enforces class invariants, making sure
   * that indexes are within bounds regarding
   * token string and that they don't "cross".
   * 
   * @param errorBeginIndex 
   * @param errorEndIndex 
   * @param tokenString 
   */
  private static validateParameters(errorBeginIndex : number,
                                    errorEndIndex : number,
                                    tokenString : string) : void
  {
    validateIndex(errorBeginIndex, "errorBeginIndex");
    validateIndex(errorEndIndex, "errorEndIndex");

    if(errorEndIndex >= tokenString.length)
    {
      throw new LogicErrorException(`errorEndIndex is expected to be < tokenString length (${tokenString.length}), but ${errorEndIndex} was passed instead.`);
    }

    if(errorBeginIndex > errorEndIndex)
    {
      throw new LogicErrorException(`errorBeginIndex is expected to be <= errorEndIndex but ${errorBeginIndex} and ${errorEndIndex} were passed instead.`);
    }
  }
  /**
   * Renders a highlight using "^" to indicate
   * where the problems are in the string.
   *
   * @param stringSize
   * @param errorBeginIndex
   * @param errorEndIndex
   */
  private static renderHighlight(stringSize : number, errorBeginIndex : number, errorEndIndex : number) : string 
  {
    /**
     * Regarding sizes: startPad + highLight + endPad = stringSize, therefore
     * endPad = stringSize - highlight - startPad = 
     * stringSize - (errorEndIndex - errorBeginIndex + inclusiveEndIndexCompensation) - errorBeginIndex = 
     * stringSize - errorEndIndex - inclusiveEndIndexCompensation.
     */
    const startPad = " ".repeat(errorBeginIndex);
    const inclusiveEndIndexCompensation = 1;
    const highlight = "^".repeat(errorEndIndex - errorBeginIndex + inclusiveEndIndexCompensation);
    const endPad = " ".repeat(stringSize - errorEndIndex - inclusiveEndIndexCompensation);
    return `${startPad}${highlight}${endPad}`;
  }
  /**
   * Sets Error's message as the CLI-compatible error
   * message, including the explanation, the token string and
   * the highlight.
   *
   * @param explanation
   * @param errorBeginIndex
   * @param errorEndIndex
   * @param tokenString
   */
  constructor(explanation : string, errorBeginIndex : number, errorEndIndex : number, tokenString : string) 
  {
    ParsingException.validateParameters(errorBeginIndex, errorEndIndex, tokenString);

    const highlight = ParsingException.renderHighlight(tokenString.length, errorBeginIndex, errorEndIndex);

    super(`${explanation}\n${tokenString}\n${highlight}`);
    
    this.explanation = explanation;
    this.errorBeginIndex = errorBeginIndex;
    this.errorEndIndex = errorEndIndex;
    this.tokenString = tokenString;
  }
  /**
   * Gets the explanation.
   */
  public getExplanation() : string 
  {
    return this.explanation;
  }
  /**
   * Gets the error begin index.
   */
  public getErrorBeginIndex() : number 
  {
    return this.errorBeginIndex;
  }
  /**
   * Gets the error end index.
   */
  public getErrorEndIndex() : number 
  {
    return this.errorEndIndex;
  }
  /**
   * Gets the error associated token string.
   */
  public getTokenString() : string 
  {
    return this.tokenString;
  }
  /**
   * Gets complete error message.
   */
  public getErrorMessage() : string
  {
    return this.message;
  }
  /**
   * An explanation of the problem found in the token string.
   */
  private readonly explanation : string;
  /**
   * The token string's index where the problem found begins.
   */
  private readonly errorBeginIndex : number;
  /**
   * The token string's index where the problem found ends.
   */
  private readonly errorEndIndex : number;
  /**
   * the token string in analysis.
   */
  private readonly tokenString : string;
}
