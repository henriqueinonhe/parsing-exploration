export class Utils
{
  public static  removeArrayDuplicates<T>(array : Array<T>, equalityTest : (elem1 : T, elem2 : T) => boolean) : Array<T>
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

  public static factorial(num : number) : number
  {
    if(!Number.isInteger(num) || num < 0)
    {
      throw new Error("Factorial is only defined for integers >= 0!");
    }

    let result = 1;
    for(let i = 1; i <= num; i++)
    {
      result *= i;
    }
    return result;
  }

  public static combinationsCount(gaps : number, occupants : number) : number
  {
  //TODO Enforce Pre Conditions
    return Utils.factorial(gaps) / ( Utils.factorial(occupants) * Utils.factorial(gaps - occupants) );
  }

  public static permutationsWithRepetitionsCount(total : number, ... repetitions : Array<number>) : number
  {
    return Utils.factorial(total) / repetitions.reduce((accum, num) => accum * Utils.factorial(num), 1);
  }

  public static findPivotIndex(dividersIndexList : Array<number>, greatestDividerIndex : number, allowEmptyGroups = false) : number
  {
    if(allowEmptyGroups)
    {
      let index = dividersIndexList.length - 1;
      while(dividersIndexList[index] === greatestDividerIndex)
      {
        index--;
      }
      return index;
    }
    else
    {
      let count = 0;
      let index = dividersIndexList.length - 1 - count;
      while(dividersIndexList[index] === greatestDividerIndex - count &&
          index >= 0)
      {
        count++;
        index = dividersIndexList.length - 1 - count;
      }
      return index;
    }
  
  }

  public static advanceToNextDividersIndexList(dividersIndexList : Array<number>, greatestDividerIndex : number, allowEmptyGroups = false) : void
  {
    const pivotIndex = Utils.findPivotIndex(dividersIndexList, greatestDividerIndex, allowEmptyGroups);
    if(pivotIndex === -1)
    {
      throw new Error("There is no next dividers index list!");
    }

    dividersIndexList[pivotIndex]++;
    if(allowEmptyGroups)
    {
      for(let index = pivotIndex + 1; index < dividersIndexList.length; index++)
      {
        dividersIndexList[index] = dividersIndexList[pivotIndex];
      }
    }
    else
    {
      for(let index = pivotIndex + 1; index < dividersIndexList.length; index++)
      {
        dividersIndexList[index] = dividersIndexList[index - 1] + 1;
      }  
    }
  }

  public static generatePartition<T>(elements : Array<T>, dividersIndexList : Array<number>) : Array<Array<T>>
  {
    const numberOfDividers = dividersIndexList.length;
    const numberOfElements = elements.length;
    const partition = [];
    partition.push(elements.slice(0, dividersIndexList[0]));
    for(let index = 0; index < dividersIndexList.length - 1; index++)
    {
      const currentDividerIndex = dividersIndexList[index];
      const nextDividerIndex = dividersIndexList[index + 1];
      partition.push(elements.slice(currentDividerIndex, nextDividerIndex));
    }
    const lastDividerIndex = dividersIndexList[numberOfDividers - 1];
    partition.push(elements.slice(lastDividerIndex, numberOfElements));

    return partition;
  }

  public static listPartitions<T>(elements : Array<T>, numberOfGroups : number, allowEmptyGroups = false) : Array<Array<Array<T>>>
  {
  //Pre Conditions
    if(elements.length == 0 && !allowEmptyGroups)
    {
      throw new Error("Elements array cannot be empty if no empty groups are allowed!");
    }

    if(numberOfGroups <= 0 || !Number.isInteger(numberOfGroups))
    {
      throw new Error("Number of groups must be a positive integer!");
    }

    if(numberOfGroups > elements.length && !allowEmptyGroups)
    {
      throw new Error("Number of groups cannot be greater than the number of elements, when no empty group allowed!");
    }

    //Special Cases
    if(numberOfGroups === 1)
    {
      return [[elements]];
    }

    if(allowEmptyGroups)
    {
    //Logic
      const numberOfElements = elements.length;
      const greatestDividerIndex = numberOfElements;
      const numberOfDividers = numberOfGroups - 1;
      const partitionList = [];
      const dividersIndexList = Array(numberOfDividers).fill(0);

      //Calculate Number of Partitions
      const numberOfPartitions = Utils.permutationsWithRepetitionsCount(numberOfDividers + numberOfElements, numberOfElements, numberOfDividers);

      //Generate Partitions
      partitionList.push(Utils.generatePartition(elements, dividersIndexList));
      for(let count = 2; count <= numberOfPartitions; count++)
      {
        Utils.advanceToNextDividersIndexList(dividersIndexList, greatestDividerIndex, true);
        partitionList.push(Utils.generatePartition(elements, dividersIndexList));
      }
  
      return partitionList;
    }
    else
    {
    //Logic
      const numberOfElements = elements.length;
      const greatestDividerIndex = numberOfElements - 1;
      const numberOfDividers = numberOfGroups - 1;
      const partitionList = [];
      const dividersIndexList = [];
  
      //Initialize Dividers Index List
      for(let index = 1; index <= numberOfDividers; index++)
      {
        dividersIndexList.push(index);
      }
  
      //Calculate Number of Partitions
      const availableDividerPositions = numberOfElements - 1;
      const numberOfPartitions = Utils.combinationsCount(availableDividerPositions, numberOfDividers);
    
      //Generate Partitions
      partitionList.push(Utils.generatePartition(elements, dividersIndexList));
      for(let count = 2; count <= numberOfPartitions; count++)
      {
        Utils.advanceToNextDividersIndexList(dividersIndexList, greatestDividerIndex);
        partitionList.push(Utils.generatePartition(elements, dividersIndexList));
      }
  
      return partitionList;
    }
  }

  //Testing still
  public static cloneArray<T>(arr : Array<Cloneable<T>>) : Array<T>
  {
    return arr.map(elem => elem.clone());
  }

  public static generateAllNumbersAsArrayInBase(base : number, size : number) : Array<Array<number>> 
  {
    const list : Array<Array<number>> = [];
    list.push(new Array(size).fill(0));
    for(let count = 0; count < Math.pow(base, size) - 1; count++)
    {
      const previousNumber = list[count];
      list.push(this.generateNextNumberAsArrayInBase(previousNumber, base));
    }
    return list;
  }

  private static generateNextNumberAsArrayInBase(arr : Array<number>, base : number) : Array<number>
  {
    const nextNumber = arr.slice();
    let elementToIncrementIndex = 0;
    while(nextNumber[elementToIncrementIndex] === (base - 1) && elementToIncrementIndex < nextNumber.length)
    {
      elementToIncrementIndex++;
    }

    if(elementToIncrementIndex === nextNumber.length)
    {
      throw "There is no next number as array!";
    }

    nextNumber[elementToIncrementIndex]++;
    for(let index = 0; index < elementToIncrementIndex; index++)
    {
      nextNumber[index] = 0;
    }

    return nextNumber;
  }
  
}

export interface Cloneable<T>
{
  clone() : T;
}
