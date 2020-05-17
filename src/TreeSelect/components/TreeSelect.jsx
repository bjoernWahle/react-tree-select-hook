import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, CheckBox, Text, TextInput } from 'grommet'
import { CaretDown, CaretUp } from 'grommet-icons'
import './styles.scss'
import { useInView } from 'react-intersection-observer'

const TreeSelectContext = React.createContext({})

export function TreeSelectNode({ option, setExpanded, getCheckboxProps }) {
  const { uiState, searchValue } = useContext(TreeSelectContext)
  const { show, expanded } = uiState[option.id] || {
    show: true,
    expanded: false
  }
  const [ref, inView] = useInView({ triggerOnce: true })

  return show ? (
    <li ref={ref} style={{ marginTop: '2px', marginBottom: '2px' }}>
      <Box direction='column'>
        <Box direction='row'>
          <CheckBox
            size='xsmall'
            label={
              <Text
                weight={
                  searchValue &&
                  option.label
                    .toLowerCase()
                    .indexOf(searchValue.toLowerCase()) > -1
                    ? 'bold'
                    : undefined
                }
                size='small'
              >
                {option.label}
              </Text>
            }
            {...getCheckboxProps(option.id)}
          />
          {option.children && option.children.length > 0 && (
            <Button
              margin='xsmall'
              plain
              icon={
                expanded ? <CaretUp size='small' /> : <CaretDown size='small' />
              }
              onClick={() => setExpanded(option.id, !expanded)}
            />
          )}
        </Box>
        <Box>
          {!!(
            option.children &&
            option.children.length > 0 &&
            expanded &&
            inView
          ) && (
            <ul>
              {option.children.map((child) => (
                <TreeSelectNode
                  key={child.label}
                  option={child}
                  setExpanded={setExpanded}
                  getCheckboxProps={getCheckboxProps}
                />
              ))}
            </ul>
          )}
        </Box>
      </Box>
    </li>
  ) : null
}

function showParents(node, newNodeUIState) {
  if (node.parent) {
    newNodeUIState[node.parent.id] = { show: true, expanded: true }
    showParents(node.parent, newNodeUIState)
  }
}

export function TreeSelect({
  nodes,
  nodeIndex,
  getCheckboxProps,
  selectAll,
  selectNone
}) {
  const [nodeUIState, setNodeUIState] = useState({})
  const [searchValue, setSearchValue] = useState('')

  const onInputChange = (searchValue) => {
    setSearchValue(searchValue)
    search(searchValue)
  }

  const search = (searchValue) => {
    const searchTerm = searchValue.toLowerCase()
    if (searchTerm.length > 0) {
      const newNodeUIState = {}
      for (const nodeId of Object.keys(nodeIndex)) {
        newNodeUIState[nodeId] = { expanded: false, show: false }
      }
      const nodes = Object.values(nodeIndex).filter(
        (node) => node.label.toLowerCase().indexOf(searchTerm) > -1
      )
      for (const node of nodes) {
        newNodeUIState[node.id] = { show: true, expanded: false }
        showParents(node, newNodeUIState)
      }
      setNodeUIState(newNodeUIState)
    } else {
      const newNodeUIState = {}
      for (const nodeId of Object.keys(nodeIndex)) {
        newNodeUIState[nodeId] = { expanded: false, show: true }
      }
      setNodeUIState(newNodeUIState)
    }
  }

  useEffect(() => {
    const newNodeUIState = {}
    for (const nodeId of Object.keys(nodeIndex)) {
      newNodeUIState[nodeId] = { expanded: false, show: true }
    }
    setNodeUIState(newNodeUIState)
  }, [nodeIndex])

  const setExpanded = (id, newValue) => {
    const node = { ...nodeUIState[id], expanded: newValue }
    const newNodeUIState = { ...nodeUIState, [id]: node }
    for (const child of nodeIndex[id].children) {
      newNodeUIState[child.id] = { ...newNodeUIState[child.id], show: true }
    }
    setNodeUIState(newNodeUIState)
  }

  return (
    <TreeSelectContext.Provider value={{ uiState: nodeUIState, searchValue }}>
      <Box>
        <Box>
          <Text size='small'>Search for element types</Text>
          <Box direction='row' gap='xsmall'>
            <Box width='200px'>
              <TextInput
                size='small'
                value={searchValue}
                onChange={(event) => onInputChange(event.target.value)}
              />
            </Box>
            <Button size='small' label='Select all' onClick={selectAll} />
            <Button size='small' label='Select none' onClick={selectNone} />
          </Box>
        </Box>
        <Box
          height={{ max: '300px' }}
          overflow='auto'
          className='tree-select-container'
        >
          <ul>
            {nodes.map((option) => (
              <TreeSelectNode
                key={option.label}
                option={option}
                getCheckboxProps={getCheckboxProps}
                setExpanded={setExpanded}
              />
            ))}
          </ul>
        </Box>
      </Box>
    </TreeSelectContext.Provider>
  )
}
