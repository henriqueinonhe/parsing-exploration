function validateMatrix<T>(matrix : Array<Array<T>>) : void
{
  if(matrix.length === 0)
  {
    throw new Error("Matrix cannot be empty!");
  }

  if(matrix[0].length === 0)
  {
    throw new Error("Columns cannot be empty!");
  }

  const firstRowLength = matrix[0].length;
  for(let index = 1; index < matrix.length; index++)
  {
    const row = matrix[index];
    if(row.length !== firstRowLength)
    {
      throw new Error("All rows must be the same length!");
    }
  }
}

export class Matrix<T>
{
  constructor(matrix : Array<Array<T>>)
  {
    validateMatrix<T>(matrix);

    this.matrix = matrix;
  }

  public rowCount() : number
  {
    return this.matrix.length;
  }

  public columnCount() : number
  {
    return this.matrix[0].length;
  }

  private matrix : Array<Array<T>>;
}

