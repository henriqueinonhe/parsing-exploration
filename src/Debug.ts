import { Grammar } from "./Grammar";
import { TokenString } from "./TokenString";

function ungersEFreeRecognizer(grammar : Grammar, sentence : TokenString) : boolean
{
  return true;
}

export function factorial(num : number) : number
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

export function arrangementCount(gaps : number, occupants : number) : number
{
  //TODO Enforce Pre Conditions
  return factorial(gaps) / ( factorial(occupants) * factorial(gaps - occupants) );
}

export function findPivotIndex(dividersIndexList : Array<number>, greatestDividerIndex : number) : number
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

export function advanceToNextDividersIndexList(dividersIndexList : Array<number>, greatestDividerIndex : number) : void
{
  const pivotIndex = findPivotIndex(dividersIndexList, greatestDividerIndex);
  if(pivotIndex === -1)
  {
    throw new Error("There is no next dividers index list!");
  }

  dividersIndexList[pivotIndex]++;
  for(let index = pivotIndex + 1; index < dividersIndexList.length; index++)
  {
    dividersIndexList[index] = dividersIndexList[index - 1] + 1;
  }  
}

export function generatePartition<T>(elements : Array<T>, dividersIndexList : Array<number>) : Array<Array<T>>
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

export function listNonEmptyPartitions<T>(elements : Array<T>, numberOfGroups : number) : Array<Array<Array<T>>>
{
  //Pre Conditions
  if(elements.length == 0)
  {
    throw new Error("Elements array cannot be empty!");
  }

  if(numberOfGroups <= 0 || !Number.isInteger(numberOfGroups))
  {
    throw new Error("Number of groups must be a positive integer!");
  }

  if(numberOfGroups > elements.length)
  {
    throw new Error("Number of groups cannot be greater than the number of elements!");
  }

  //Special Case
  if(numberOfGroups === 1)
  {
    return [[elements]];
  }

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
  const numberOfPartitions = arrangementCount(availableDividerPositions, numberOfDividers);
  
  //Generate Partitions
  partitionList.push(generatePartition(elements, dividersIndexList));
  for(let count = 2; count <= numberOfPartitions; count++)
  {
    advanceToNextDividersIndexList(dividersIndexList, greatestDividerIndex);
    partitionList.push(generatePartition(elements, dividersIndexList));
  }

  return partitionList;
}