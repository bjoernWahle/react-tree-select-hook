import { buildNodeIndex } from './TreeUtils'

describe('buildNodeIndex', () => {
  it('should create an object with the ids of each node as the key and the node as the value', () => {
    const treeNodes = [
      { id: '1', label: 'L1-1', children: [{ id: '2', label: 'L2-1' }] },
      { id: '3', label: 'L1-2' }
    ]
    const nodeIndex = buildNodeIndex(treeNodes)
    expect(Object.keys(nodeIndex)).toEqual(['1', '2', '3'])
    expect(nodeIndex['1'].label).toBe('L1-1')
  })
})
