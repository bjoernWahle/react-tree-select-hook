import { reduceTrees } from './TreeUtils'

describe('mergeTrees', () => {
  describe('for 2 simple trees', () => {
    const sampleTreeA = {
      label: 'root',
      children: [{ label: 'A', children: [{ label: '1', forgeObjectId: 1 }] }]
    }
    const sampleTreeB = {
      label: 'root',
      children: [{ label: 'A', children: [{ label: '2', forgeObjectId: 2 }] }]
    }
    it('should return a merged tree', () => {
      const newTree = [sampleTreeA, sampleTreeB].reduce((previous, current) =>
        reduceTrees(previous, current)
      )
      expect(newTree).toEqual({
        label: 'root',
        children: [
          {
            label: 'A',
            children: [
              {
                label: '1',
                forgeObjectId: 1
              },
              {
                label: '2',
                forgeObjectId: 2
              }
            ]
          }
        ]
      })
    })
  })
})
