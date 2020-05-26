/**
 * Exception used to signal that an invalid argument was given to a function,
 * that is, the argument is outside of the function's domain.
 */
export class InvalidArgumentException extends Error
{
  constructor(message : string)
  {
    super(`Invalid Argument!\n${message}`);
    this.type = "InvalidArgumentException";
  }
  public type : string;
}

/**
 * Exception used to signal that a programming error occurred.
 */
export class LogicErrorException extends Error
{
  constructor(message : string)
  {
    super(`Logic Error!\n${message}`);
    this.type = "LogicErrorException";
  }
  private type : string;
}

/**
 * Validates index candidates, to make sure they 
 * are positive integers and if they are not,
 * throws an exception describing the problem and
 * incorporating a varibaleName.
 * 
 * @param index 
 * @param indexName The variable name to be incorporated in the error message
 */
export function validateIndex(index : number, indexName = "index", arraySize = Infinity, arrayName = "array") : void
{
  if(!Number.isInteger(index))
  {
    throw new LogicErrorException(`${indexName} is expected to be an integer, but ${index} was passed instead!`);
  }

  if(index < 0)
  {
    throw new LogicErrorException(`${indexName} is expected to be a positive number, but ${index} was passed instead!`);
  }

  if(index >= arraySize)
  {
    throw new LogicErrorException(`There is no element associated with index ${index} in ${arrayName}`);
  }
}