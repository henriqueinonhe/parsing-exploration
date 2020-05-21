export class Utils
{
  public static removeArrayDuplicates<T>(array : Array<T>, equalityTest : (elem1 : T, elem2 : T) => boolean) : Array<T>
  {
    const arrayWithoutDuplicates = [] as Array<T>;
    for(const elem of array)
    {
      if( arrayWithoutDuplicates.every(elem2 => !equalityTest(elem, elem2) ) )
      {
        arrayWithoutDuplicates.push(elem);
      }
    }
    return arrayWithoutDuplicates;
  }
}
