import { Utils } from "../Core/Utils";

class Thread
{
  constructor(currentState : string)
  {
    this.currentState = currentState;
    this.inputReadIndex = 0;
    this.log = [currentState];
  }

  public advance(nextState : string) : void
  {
    this.currentState = nextState;
    this.inputReadIndex++;
    this.log.push(nextState);
  }

  public clone() : Thread
  {
    const newThread = new Thread(this.currentState);
    newThread.inputReadIndex = this.inputReadIndex;
    newThread.log = this.log.slice();

    return newThread;
  }

  public currentState : string;
  public inputReadIndex : number;
  public log : Array<string>;
}

export enum FiniteStateAutomatonExecutionPolicy
{
  DepthFirst,
  BreadthFirst
}

export class FiniteStateAutomaton
{
  private static validateStates(initialState : string, acceptState : string, states : Array<string>) : void
  {
    if(!states.includes(initialState))
    {
      throw new Error(`Initial state is "${initialState}" but it is not contained in the states array!`);
    }
    
    if(!states.includes(acceptState))
    {
      throw new Error(`Accept state is "${acceptState}", but it is not contained in the states array!`);
    }
  }
  
  constructor(initialState : string, states : Array<string>, transitions : Array<TransitionTableEntry>, acceptState : string)
  {
    FiniteStateAutomaton.validateStates(initialState, acceptState, states);
    this.initialState = initialState;
    this.acceptState = acceptState;

    const statesWithoutDuplicates = Utils.removeArrayDuplicates(states, (e1, e2) => e1 === e2);
    this.states = statesWithoutDuplicates;

    this.transitionTable = {};
    const transitionsWithoutDuplicates = Utils.removeArrayDuplicates(transitions, (e1, e2) =>
    {
      return e1.currentState === e2.currentState &&
             e1.condition === e2.condition && 
             e1.nextState === e2.nextState;
    });
    for(const transition of transitionsWithoutDuplicates)
    {
      if(this.transitionTable[transition.currentState] === undefined)
      {
        this.transitionTable[transition.currentState] = {};
      }

      if(this.transitionTable[transition.currentState][transition.condition] === undefined)
      {
        this.transitionTable[transition.currentState][transition.condition] = [];
      }

      this.transitionTable[transition.currentState][transition.condition].push(transition.nextState);
    }

    this.input = [];
    this.running = false;
    this.livingThreads = [new Thread(initialState)];
    this.finishedThreads = [];
    this.executionPolicy = FiniteStateAutomatonExecutionPolicy.BreadthFirst;
    this.currentThreadIndex = 0;
  }

  public compute(steps = 1) : FiniteStateAutomaton
  {
    if(this.executionPolicy === FiniteStateAutomatonExecutionPolicy.DepthFirst)
    {
      for(let step = 0; step < steps; step++)
      {
        //asdasd
      }
    }
    else
    {
      for(let step = 0; step < steps; step++)
      {
        //
      }
    }

    return this;
  }

  public setInput(input : Array<string>) : void
  {
    if(this.running)
    {
      throw new Error("Cannot set input as machine is still running!");
    }
    this.input = input.slice();
  }

  public getInput() : Array<string>
  {
    return this.input;
  }

  public isRunning() : boolean
  {
    return this.running;
  }

  public hasFinished() : boolean
  {
    return this.livingThreads.length === 0;
  }

  public reset() : void
  {
    this.livingThreads = [new Thread(this.initialState)];
    this.finishedThreads = [];
    this.running = false;
  }

  public setExecutionPolicy(policy : FiniteStateAutomatonExecutionPolicy) : void
  {
    if(this.isRunning())
    {
      throw new Error("Cannot set execution policy while machine is still running!");
    }

    this.executionPolicy = policy;
  }

  private computeNextStep() : FiniteStateAutomaton
  {
    if(this.hasFinished())
    {
      throw new Error("Cannot compute next step as machine has already finished running!");
    }

    if(this.executionPolicy === FiniteStateAutomatonExecutionPolicy.DepthFirst)
    {
      const currentThread = this.livingThreads[0];
      const currentState = currentThread.currentState;
      const currentInputToken = this.input[currentThread.inputReadIndex];
      const nextPossibleStates = this.transitionTable[currentState][currentInputToken];
      const newThreads = [currentThread];
      for(let threadCount = 1; threadCount < nextPossibleStates.length; threadCount++)
      {
        newThreads.push(currentThread.clone());
      }
      newThreads.forEach((thread, index) => thread.advance(nextPossibleStates[index]));

      
    }
    else
    {

    }
  }


  private initialState : string;
  private states : Array<string>;
  private transitionTable : TransitionTable;
  private acceptState : string;
  private input : Array<string>;
  private running : boolean;
  private livingThreads : Array<Thread>;
  private finishedThreads : Array<Thread>;
  private executionPolicy : FiniteStateAutomatonExecutionPolicy;
  private currentThreadIndex : number;
}

interface TransitionTableEntry
{
  currentState : string;
  condition : string;
  nextState : string;
}

interface TransitionTable
{
  [state : string] : {[condition : string] : Array<string>/* next state array */};
}