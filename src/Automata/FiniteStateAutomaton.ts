import { Utils } from "../Core/Utils";

class Thread
{
  constructor(currentState : string)
  {
    this.inputReadIndex = 0;
    this.log = [currentState];
  }

  public nonEmptyTransition(nextState : string) : Thread
  {
    this.log.push(nextState);
    this.inputReadIndex++;
    return this;
  }

  public emptyTransition(nextState : string) : Thread
  {
    this.log.push(nextState);
    return this;
  }

  public currentState() : string
  {
    return this.log[this.log.length - 1];
  }

  public getInputReadIndex() : number
  {
    return this.inputReadIndex;
  }

  public getLog() : Array<string>
  {
    return this.log.slice();
  }

  public clone() : Thread
  {
    const newThread = new Thread(this.log[0]);
    newThread.inputReadIndex = this.inputReadIndex;
    newThread.log = this.log.slice();

    return newThread;
  }

  private log : Array<string>;
  private inputReadIndex : number;
}

export class FiniteStateAutomaton
{
  private static validateStates(initialState : string, acceptState : string, transitions : Array<TransitionTableEntry>, states : Array<string>) : void
  {
    if(!states.includes(initialState))
    {
      throw new Error(`Initial state is "${initialState}" but it is not contained in the states array!`);
    }
    
    if(!states.includes(acceptState))
    {
      throw new Error(`Accept state is "${acceptState}", but it is not contained in the states array!`);
    }

    if(transitions.some(transition => !states.includes(transition.currentState) || !states.includes(transition.nextState)))
    {
      throw new Error("A transition mentions a state that is not contained in the states array!");
    }
  }
  
  private static buildTransitionTable(states : Array<string>, transitions : Array<TransitionTableEntry>) : TransitionTable
  {
    const transitionTable : TransitionTable = {};
    for(const state of states)
    {
      transitionTable[state] = {};
    }

    for(const transition of transitions)
    {
      if(transitionTable[transition.currentState][transition.condition] === undefined)
      {
        transitionTable[transition.currentState][transition.condition] = [];
      }

      transitionTable[transition.currentState][transition.condition].push(transition.nextState);
    }

    return transitionTable;
  }

  constructor(initialState : string, states : Array<string>, transitions : Array<TransitionTableEntry>, acceptState : string)
  {
    FiniteStateAutomaton.validateStates(initialState, acceptState, transitions, states);
    this.initialState = initialState;
    this.acceptState = acceptState;

    const statesWithoutDuplicates = Utils.removeArrayDuplicates(states, (e1, e2) => e1 === e2);
    this.states = statesWithoutDuplicates;

    const transitionsWithoutDuplicates = Utils.removeArrayDuplicates(transitions, (e1, e2) =>
    {
      return e1.currentState === e2.currentState &&
             e1.condition === e2.condition && 
             e1.nextState === e2.nextState;
    });
    this.transitionTable = FiniteStateAutomaton.buildTransitionTable(statesWithoutDuplicates, transitionsWithoutDuplicates);

    this.input = [];
    this.running = false;
    this.openThreads = [];
    this.closedThreads = [new Thread(initialState)];
  }

  public compute(steps = 1) : FiniteStateAutomaton
  {
    for(let step = 1; step <= steps; step++)
    {
      this.computeNextStep();
    }
    return this;
  }

  public computeAll() : FiniteStateAutomaton
  {
    while(!this.hasFinished())
    {
      this.computeNextStep();
    }
    return this;
  }

  public setInput(input : Array<string>) : void
  {
    if(this.isRunning())
    {
      throw new Error("Cannot set input as machine is still running!");
    }
    this.input = input.slice();
    this.reset();
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
    return this.openThreads.length === 0;
  }

  public reset() : void
  {
    if(this.input.length === 0)
    {
      this.openThreads = [];
      this.closedThreads = [new Thread(this.initialState)];
      this.running = false;
    }
    else
    {
      this.openThreads = [new Thread(this.initialState)];
      this.closedThreads = [];
      this.running = false;
    }
  }

  private computeNextStep() : FiniteStateAutomaton
  {
    if(this.hasFinished())
    {
      throw new Error("Cannot compute next step as machine has already finished running!");
    }

    const currentThread = this.openThreads[0];
    const currentState = currentThread.currentState();
    const currentInputToken = this.input[currentThread.getInputReadIndex()];
    const nonEmptyTransitionNextPossibleStates =  this.transitionTable[currentState][currentInputToken] || [];
    const emptyTransitionNextPossibleStates = this.transitionTable[currentState][""] || [];
    const newNonEmptyTransitionThreads = nonEmptyTransitionNextPossibleStates.map(nextState => currentThread.clone().nonEmptyTransition(nextState));
    const newEmptyTransitionThreads = emptyTransitionNextPossibleStates.map(nextState => currentThread.clone().emptyTransition(nextState));
    const newThreads = [...newNonEmptyTransitionThreads, ...newEmptyTransitionThreads];
    const newOpenThreads = Utils.cloneArray(newThreads.filter(thread => this.isOpenThread(thread)));
    const newClosedThreads = Utils.cloneArray(newThreads.filter(thread => this.isClosedThread(thread)));
    
    this.openThreads.shift();
    this.openThreads.push(...newOpenThreads);
    this.closedThreads.push(...newClosedThreads);
    this.running = !this.hasFinished();

    return this;
  }

  private isOpenThread(thread : Thread) : boolean
  {
    return !this.noAvailableTransition(thread);
  }

  private isClosedThread(thread : Thread) : boolean
  {
    return thread.getInputReadIndex() === this.input.length ||
           this.noAvailableTransition(thread);
  }

  private noAvailableTransition(thread : Thread) : boolean
  {
    return this.transitionTable[thread.currentState()][this.input[thread.getInputReadIndex()]] === undefined &&
    this.transitionTable[thread.currentState()][""] === undefined;
  }

  public hasAccepted() : boolean
  {
    return this.closedThreads.some(thread => thread.currentState() === this.acceptState);
  }

  public getOpenThreads() : Array<Thread>
  {
    return Utils.cloneArray(this.openThreads);
  }

  public getClosedThreads() : Array<Thread>
  {
    return Utils.cloneArray(this.closedThreads);
  }

  public getInitialState() : string
  {
    return this.initialState;
  }

  public getStates() : Array<string>
  {
    return this.states.slice();
  }

  public getTransitions() : Array<TransitionTableEntry>
  {
    const transitions : Array<TransitionTableEntry> = [];
    for(const state in this.transitionTable)
    {
      for(const condition in this.transitionTable[state])
      {
        for(const nextState of this.transitionTable[state][condition])
        {
          transitions.push({currentState: state, condition: condition, nextState: nextState});
        }
      }
    } 
    return transitions;
  }

  public getAcceptState() : string
  {
    return this.acceptState;
  }

  private initialState : string;
  private states : Array<string>;
  private transitionTable : TransitionTable;
  private acceptState : string;
  private input : Array<string>;
  private running : boolean;
  private openThreads : Array<Thread>;
  private closedThreads : Array<Thread>;
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