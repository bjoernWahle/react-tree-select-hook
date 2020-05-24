import {
  addParentsAndIds,
  buildNodeIndex,
  checkAndUpdate,
  copyNodes,
  flatCollectCheckedNodes,
  treeToMap
} from '../TreeUtils';
import { Reducer, useMemo, useReducer } from 'react';

function buildInitialState(nodes: NodeLike[]): TreeSelectState {
  const preparedNodes: Node[] = addParentsAndIds(copyNodes(nodes));
  const initialState = treeToMap(preparedNodes, true);
  const nodeIndex = buildNodeIndex(preparedNodes);
  const expanded = treeToMap(preparedNodes, false);
  return { checked: initialState, nodeIndex, expanded };
}

type TreeSelectReducer = Reducer<TreeSelectState, TreeSelectActionTypes>;

enum actionTypes {
  toggleNode = 'toggle_node',
  checkAll = 'check_all',
  checkNone = 'check_none',
  setNodes = 'set_nodes',
  toggleExpanded = 'toggle_expanded'
}

interface ToggleNodeAction {
  type: actionTypes.toggleNode;
  payload: ToggleNodePayload;
}

interface SetNodesAction {
  type: actionTypes.setNodes;
  payload: NodesPayload;
}

interface CheckAllAction {
  type: typeof actionTypes.checkAll;
}

interface CheckNoneAction {
  type: typeof actionTypes.checkNone;
}

interface ToggleExpandedAction {
  type: typeof actionTypes.toggleExpanded;
  payload: ToggleNodePayload;
}

type TreeSelectActionTypes =
  | ToggleNodeAction
  | CheckAllAction
  | CheckNoneAction
  | SetNodesAction
  | ToggleExpandedAction;

interface NodesPayload {
  nodes: NodeLike[];
}

interface ToggleNodePayload {
  id: string;
}

interface TreeSelectState {
  checked: Record<string, boolean>;
  expanded: Record<string, boolean>;
  nodeIndex: Record<string, Node>;
}

interface NodeLike {
  label: string;
  children?: NodeLike;
}

interface Node {
  id: string;
  label: string;
  children?: Node[];
  parent?: Node;
}

export const treeSelectReducer = (
  state: TreeSelectState,
  action: TreeSelectActionTypes
): TreeSelectState => {
  const { checked, nodeIndex } = state;
  switch (action.type) {
    case actionTypes.toggleNode: {
      const id = (action as ToggleNodeAction).payload.id;
      const newValue = !checked[id];
      const updates = checkAndUpdate(nodeIndex, checked, id, newValue);
      const newCheckedState = {};
      for (const [nodeId, nodeChecked] of Object.entries(checked)) {
        newCheckedState[nodeId] =
          updates[nodeId] !== undefined ? updates[nodeId] : nodeChecked;
      }
      return { ...state, nodeIndex, checked: newCheckedState };
    }
    case actionTypes.checkAll: {
      const allChecked = Object.keys(nodeIndex).reduce(
        (acc: Record<string, boolean>, id) => {
          acc[id] = true;
          return acc;
        },
        {}
      );
      return { ...state, nodeIndex, checked: allChecked };
    }
    case actionTypes.checkNone: {
      const noneChecked = Object.keys(nodeIndex).reduce(
        (acc: Record<string, boolean>, id) => {
          acc[id] = false;
          return acc;
        },
        {}
      );
      return { ...state, nodeIndex, checked: noneChecked };
    }
    case actionTypes.setNodes: {
      return buildInitialState((action as SetNodesAction).payload.nodes);
    }
    case actionTypes.toggleExpanded: {
      return {
        ...state,
        expanded: {
          ...state.expanded,
          [(action as ToggleExpandedAction).payload.id]: !state.expanded[
            (action as ToggleExpandedAction).payload.id
          ]
        }
      };
    }
  }
  return state;
};

export function useTreeSelect(
  rawNodes: NodeLike[],
  reducer: TreeSelectReducer = treeSelectReducer
): {
  toggleChecked: (id: string) => void;
  state: TreeSelectState;
  selectAll: () => void;
  selectNone: () => void;
  setNodes: (nodes: NodeLike[]) => void;
  nodes: Node[];
  isExpanded: (id: string) => boolean;
  getExpandButtonProps: (
    id: string
  ) => {
    onClick: () => void;
  };
  getCheckboxProps: (
    id: string
  ) => {
    checked: boolean;
    onChange: () => void;
    type: string;
  };
  simplifiedSelection: Node[];
} {
  const [state, dispatch] = useReducer<TreeSelectReducer, NodeLike[]>(
    reducer,
    rawNodes,
    buildInitialState
  );
  const toggleChecked = (id: string): void => {
    dispatch({ type: actionTypes.toggleNode, payload: { id: id } });
  };
  const selectAll = (): void => {
    dispatch({ type: actionTypes.checkAll });
  };
  const selectNone = (): void => {
    dispatch({ type: actionTypes.checkNone });
  };
  const setNodes = (nodes: NodeLike[]): void => {
    dispatch({ type: actionTypes.setNodes, payload: { nodes } });
  };
  const toggleExpanded = (id: string): void => {
    dispatch({ type: actionTypes.toggleExpanded, payload: { id } });
  };
  const getCheckboxProps = (
    id: string
  ): {
    checked: boolean;
    onChange: () => void;
    type: string;
  } => {
    return {
      checked: state.checked[id],
      onChange: (): void => toggleChecked(id),
      type: 'checkbox'
    };
  };
  const getExpandButtonProps = (
    id: string
  ): {
    onClick: () => void;
  } => {
    return {
      onClick: (): void => {
        toggleExpanded(id);
      }
    };
  };
  const isExpanded = (id: string): boolean => {
    return state.expanded[id];
  };
  const nodes = useMemo((): Node[] => {
    return (Object.values(state.nodeIndex) as Node[]).filter(
      (node: Node) => node.parent === undefined
    );
  }, [state.nodeIndex]);
  const simplifiedSelection = useMemo(
    () => flatCollectCheckedNodes(nodes, state.checked),
    [nodes, state.checked]
  );

  return {
    nodes,
    state,
    toggleChecked,
    selectAll,
    selectNone,
    setNodes,
    getCheckboxProps,
    getExpandButtonProps,
    isExpanded,
    simplifiedSelection
  };
}
