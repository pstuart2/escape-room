import * as React from 'react'
import { Component } from 'react'
import { Game } from '../../api/games'
import { AnswerState, GameData, ScriptState } from '../../api/gameData'

export interface CustomDashboardProps {
  game: Game
}

export interface GameDataProps {
  gameData: GameData
}

export class WrongAnswer extends Component {
  render() {
    return <h1 className="text-danger">Wrong!</h1>
  }
}

export class CorrectAnswer extends Component {
  render() {
    return <h1 className="text-success">Correct!</h1>
  }
}

const getDistance = (d1: number, d2: number) => {
  if (d1 === d2) {
    return <h1 className="text-success">{d1}</h1>
  }

  return <h1 className="text-warning">{d1}</h1>
}

export class ThirdGate extends Component<GameDataProps> {
  render() {
    const { gameData } = this.props
    const { currentDistances, currentDistanceTestIndex, currentDistanceTestSeconds, gate3Answer } = gameData
    const e = gate3Answer[currentDistanceTestIndex]

    return (
      <>
        <h1>{currentDistanceTestSeconds} seconds</h1>
        <div className="row text-info" style={{ textAlign: 'center' }}>
          <div className="col-sm">
            <h1>{e.distances[0]}</h1>
          </div>
          <div className="col-sm">
            <h1>{e.distances[1]}</h1>
          </div>
          <div className="col-sm">
            <h1>{e.distances[2]}</h1>
          </div>
        </div>
        <div className="row" style={{ textAlign: 'center' }}>
          <div className="col-sm">{getDistance(currentDistances[0], e.distances[0])}</div>
          <div className="col-sm">{getDistance(currentDistances[1], e.distances[1])}</div>
          <div className="col-sm">{getDistance(currentDistances[2], e.distances[2])}</div>
        </div>
      </>
    )
  }
}

export class Answering extends Component<CustomDashboardProps> {
  render() {
    const {
      game: { data },
    } = this.props

    switch (data.answerState) {
      case AnswerState.Correct:
        return <CorrectAnswer />
      case AnswerState.Wrong:
        return <WrongAnswer />
    }

    switch (data.scriptState) {
      case ScriptState.InFirstGate:
        return (
          <>
            <h3>{data.clueForFirstGate}</h3>
            <h2>{data.stateAnswer.toUpperCase()}</h2>
          </>
        )

      case ScriptState.InSecondGate:
        return (
          <>
            <h3>{data.clueForSecondGate}</h3>
            <h2>{data.stateAnswer.toUpperCase()}</h2>
          </>
        )

      case ScriptState.InThirdGate:
        return <ThirdGate gameData={data} />
    }
  }
}

export class CustomDashboard extends Component<CustomDashboardProps> {
  render() {
    const { game } = this.props

    if (!game || !game.data) {
      return null
    }

    switch (game.data.scriptState) {
      case ScriptState.InFirstGate:
      case ScriptState.InSecondGate:
      case ScriptState.InThirdGate:
        return <Answering game={game} />

      case ScriptState.WaitingOnFirstKey:
        return (
          <>
            <h2>{game.data.clueText}</h2>
          </>
        )
      case ScriptState.WaitingOnSecondKey:
        return (
          <>
            <h2>{game.data.clueForSecondKey}</h2>
            <h3>{game.data.clueText}</h3>
          </>
        )
      case ScriptState.WaitingOnThirdKey:
        return (
          <>
            <h2>{game.data.clueForThirdKey}</h2>
            <h3>{game.data.clueText}</h3>
          </>
        )

      case ScriptState.WaitingOnEgg:
        return <h1>Egg!</h1>

      case ScriptState.Complete:
        return <h1>Done</h1>
    }
  }
}
