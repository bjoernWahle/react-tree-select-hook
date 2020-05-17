import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { TreeSelect } from './TreeSelect'
import { useTree } from '../hooks/useTree'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'

const sampleOptions = [
  {
    id: '1',
    label: 'Drinks',
    children: [
      {
        id: '2',
        label: 'Coke',
        children: [
          {
            id: '3',
            label: '12345'
          }
        ]
      },
      {
        id: '4',
        label: 'Water',
        children: [
          {
            id: '5',
            label: '134325'
          }
        ]
      }
    ]
  },
  {
    id: '6',
    label: 'Snacks',
    children: [
      {
        id: 7,
        label: 'Cookies'
      }
    ]
  }
]

describe('TreeSelect', () => {
  it('displays a tree with 2 nodes', async () => {
    const App = () => {
      mockAllIsIntersecting(true)
      const {
        nodes,
        checkedState,
        nodeIndex,
        onToggle,
        selectAll,
        selectNone
      } = useTree(sampleOptions)
      return (
        <TreeSelect
          options={nodes}
          nodeIndex={nodeIndex}
          checkedState={checkedState}
          onChange={onToggle}
          selectAll={selectAll}
          selectNone={selectNone}
        />
      )
    }
    render(<App />)

    fireEvent.click(screen.getByText('Drinks'))
    expect((await screen.findAllByRole('node')).length).toBe(2)
  })
})
