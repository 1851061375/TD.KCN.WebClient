export interface TreeNode {
    value: string;
    title: string | null;
    children: TreeNode[];
    isLeaf?: boolean;
    disabled?: boolean;
  }
  