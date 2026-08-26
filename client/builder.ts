type Child = Node | string | number | null | false

export function el<K extends keyof HTMLElementTagNameMap>(
  parent: Node,
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  Object.assign(node, props)
  for (const c of children) {
    if (c == null || c === false) continue
    node.append(c instanceof Node ? c : String(c))
  }
  parent.appendChild(node)
  return node
}