import * as React from 'react'
import { Id } from '../../api/models'
import { Link } from 'react-router-dom'

export interface TabNavProps {
  gameId: Id
  active: string
}

const getClassName = (link: string, active: string) => {
  const base = 'nav-item nav-link'

  return link === active ? `${base} active` : base
}

export const TabNav = ({ gameId, active }: TabNavProps) => (
  <nav>
    <div className="nav nav-tabs" role="tablist" style={{ marginBottom: '10px' }}>
      <Link className={getClassName('game', active)} data-toggle="tab" to={`/${gameId}`}>
        Game
      </Link>
      <Link className={getClassName('players', active)} data-toggle="tab" to={`/${gameId}/players`}>
        Players
      </Link>
    </div>
  </nav>
)
