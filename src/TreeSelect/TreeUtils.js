export function flatCollectCheckedNodes(nodes, checked, acc = []) {
  return nodes.reduce((acc, node) => {
    if (checked[node.id]) {
      return [...acc, node]
    } else {
      if (node.children && node.children.length > 0) {
        return flatCollectCheckedNodes(node.children, checked, acc)
      } else {
        return acc
      }
    }
  }, acc)
}

export function copyNodes(nodes) {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? copyNodes(node.children) : undefined
  }))
}

export function findAndShowByLabelLike(nodes, searchTerm) {
  const [newNodes, anyMatch] = nodes.reduce(
    ([newOptions, anyMatch], el) => {
      const newEl = {
        ...el,
        show: el.label.indexOf(searchTerm) > -1
      }
      if (el.children && el.children.length > 0) {
        const [childNodes, anyMatch] = findAndShowByLabelLike(
          el.children,
          searchTerm
        )
        newEl.children = childNodes
        newEl.expanded = anyMatch
        newEl.show = el.label.indexOf(searchTerm) > -1 || anyMatch
      }
      return [[...newOptions, newEl], anyMatch || newEl.show]
    },
    [[], false]
  )
  return [newNodes, anyMatch]
}

export function buildNodeIndex(nodes, index) {
  nodes.forEach((node) => {
    index[node.id] = node
    if (node.children) {
      buildNodeIndex(node.children, index)
    }
  })
}

function updateParents(node, checkedState, updates) {
  if (node.parent) {
    const siblings = node.parent.children.filter(
      (child) => child.id !== node.id
    )
    const allChecked = siblings.every((sibling) => checkedState[sibling.id])
    updates[node.parent.id] = allChecked
    if (allChecked) {
      updateParents(node.parent, checkedState, updates)
    } else {
      uncheckParents(node.parent, updates)
    }
  }
}

function uncheckParents(node, updates) {
  updates[node.id] = false
  if (node.parent) {
    uncheckParents(node.parent, updates)
  }
}

function updateChildren(node, updates, value) {
  if (node.children) {
    for (const child of node.children) {
      updates[child.id] = value
      updateChildren(child, updates, value)
    }
  }
}

export function checkAndUpdateTree(treeNodes, checkedState) {
  let allChecked = true
  treeNodes.forEach((treeNode) => {
    if (treeNode.children) {
      checkedState[treeNode.id] = checkAndUpdateTree(
        treeNode.children,
        checkedState
      )
    }
    allChecked = allChecked && checkedState[treeNode.id]
  })
  return allChecked
}

export function checkAndUpdate(nodeIndex, checkedState, id, newValue) {
  const updates = { [id]: newValue }
  updateChildren(nodeIndex[id], updates, newValue)
  if (!newValue) {
    if (nodeIndex[id].parent) {
      uncheckParents(nodeIndex[id], updates)
    }
  } else {
    updateParents(nodeIndex[id], checkedState, updates)
  }
  return updates
}

export function addParentsAndIds(nodes, parent) {
  for (const node of nodes) {
    if (parent) {
      node.parent = parent
      node.id = parent.id + '/' + node.label
    } else {
      node.id = node.label
    }
    if (node.children) {
      node.children = addParentsAndIds(node.children, node)
    }
  }
  return nodes
}

export function treeToMap(options, value, acc = {}) {
  return options.reduce((acc, option) => {
    acc[option.id] = value
    treeToMap(option.children || [], value, acc)
    return acc
  }, acc)
}

/**
 * This function merges two trees recursively
 * @param acc
 * @param next
 * @returns {{children: *[], forgeObjectIds}|*}
 */
export function reduceTrees(acc, next) {
  if (!acc) {
    return next
  }
  if (!next) {
    return acc
  }
  if (acc.children && next.children) {
    for (const otherChild of next.children) {
      let accChild = acc.children.find((el) => el.label === otherChild.label)
      if (accChild) {
        accChild = reduceTrees(accChild, otherChild)
      } else {
        acc.children.push(otherChild)
      }
    }
  }
  return acc
}
