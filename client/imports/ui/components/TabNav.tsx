import * as React from 'react'
import { Link } from 'react-router-dom'
import { Game } from '../../api/games'

export interface TabNavProps {
  game: Game
  active: string
}

const getClassName = (link: string, active: string) => {
  const base = 'nav-item nav-link'

  return link === active ? `${base} active` : base
}

export const TabNav = ({ game, active }: TabNavProps) => (
  <nav>
    <div className="nav nav-tabs" role="tablist" style={{ marginBottom: '10px' }}>
      <Link className={getClassName('game', active)} data-toggle="tab" to={`/${game._id}`}>
        Game
      </Link>
      <Link className={getClassName('players', active)} data-toggle="tab" to={`/${game._id}/players`}>
        Players&nbsp;&nbsp;<span className="badge badge-info">{game.players.length}</span>
      </Link>
    </div>
  </nav>
)
