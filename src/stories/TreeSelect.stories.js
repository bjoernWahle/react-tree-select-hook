import { TreeSelect } from '../TreeSelect/components/TreeSelect'
import React from 'react'
import { getSampleOptions } from '../TreeSelect/components/sampleOptions'
import { useTree } from '../TreeSelect/hooks/useTree'
import { Box } from 'grommet'

export default { title: 'TreeSelect' }

const elementTypeNodes = getSampleOptions()
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

export const GrommetWithSearchBox = () => {
  const {
    nodes,
    treeSelectState: { nodeIndex },
    selectAll,
    selectNone,
    getCheckboxProps
  } = useTree(elementTypeNodes)

  return (
    <TreeSelect
      selectAll={selectAll}
      selectNone={selectNone}
      getCheckboxProps={getCheckboxProps}
      nodeIndex={nodeIndex}
      nodes={nodes}
    />
  )
}

export const Standard = () => {
  const {
    nodes,
    getCheckboxProps,
    getExpandButtonProps,
    isExpanded,
    simplifiedSelection
  } = useTree(elementTypeNodes)

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
    <Box>
      <span>{simplifiedSelection.map((el) => el.label).join(', ')}</span>
      <ul>
        {nodes.map((node) => {
          return <TreeSelectNode key={node.id} node={node} />
        })}
      </ul>
    </Box>
  )
}
