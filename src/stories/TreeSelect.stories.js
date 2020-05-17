import React from 'react'
import { useTreeSelect } from '..'

export default { title: 'TreeSelect' }

const drinksAndSnacksNodes = [
  {
    label: 'Drinks',
    children: [
      {
        label: 'Coke'
      },
      {
        label: 'Water'
      }
    ]
  },
  {
    label: 'Snacks',
    children: [
      {
        label: 'Cookies'
      }
    ]
  }
]

export const Standard = () => {
  const {
    nodes,
    getCheckboxProps,
    getExpandButtonProps,
    isExpanded,
    simplifiedSelection
  } = useTreeSelect(drinksAndSnacksNodes)

  const TreeSelectNode = ({ node }) => {
    return (
      <li>
        <label>
          <input {...getCheckboxProps(node.id)} />
          {node.label}
          {node.children && (
            <button {...getExpandButtonProps(node.id)} type='button'>
              {isExpanded(node.id) ? '-' : '+'}
            </button>
          )}
        </label>
        {node.children && isExpanded(node.id) && (
          <ul>
            {node.children.map((node) => (
              <TreeSelectNode key={node.id} node={node} />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div>
      <span>{simplifiedSelection.map((el) => el.label).join(', ')}</span>
      <ul>
        {nodes.map((node) => {
          return <TreeSelectNode key={node.id} node={node} />
        })}
      </ul>
    </div>
  )
}
