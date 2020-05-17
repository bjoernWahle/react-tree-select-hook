# react-tree-select-hook

> A headless tree select utility using hooks.

[![NPM](https://img.shields.io/npm/v/react-tree-select-hook.svg)](https://www.npmjs.com/package/react-tree-select-box) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-tree-select-hook
```

## Usage

```tsx
import React from 'react'
import { useTreeSelect } from 'react-tree-select-hook'

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

  // Since the tree can have a variable number of levels, let's define a component that renders
  // in a recursive way
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


```

## License

MIT © [Björn Wahle](https://github.com/bjoernWahle)
