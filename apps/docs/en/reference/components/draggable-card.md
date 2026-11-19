# RDraggableCard

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

The component uses Naive UI Card and Interact.js. It teleports the card to an application-managed container outside the original parent's layout flow. With a title, drag the header. Otherwise, drag the content. Resizing is outside the component's interaction model.

| Prop                  | Default                           | Description                                                                                                       |
| --------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `dad`                 | `true`                            | Enables dragging.                                                                                                 |
| `restrictionElement`  | `'body'`                          | Movement boundary. Accepts a CSS selector, an element, or a target Vue can unwrap. Selectors use the first match. |
| `restrictRectOptions` | Default boundary, `endOnly: true` | Overrides the Interact.js restriction.                                                                            |
| `defaultPosition`     | `{ x: 0, y: 0 }`                  | Offset relative to the boundary or a named preset.                                                                |
| `padding`             | None                              | `{ x, y }` spacing from the boundary on initial placement.                                                        |
| `width` / `zIndex`    | `600` / unspecified               | Card width and stacking order.                                                                                    |
| `animation`           | `false`                           | Enables the entrance transition.                                                                                  |

Position presets are `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center`, `top-center`, and `bottom-center`. Replacing `defaultPosition`, `padding`, or the boundary reference repositions the card. Toggling `dad` keeps its current position. Drag events and position persistence are internal. Use a selector that exists in the layout and a boundary with a definite size. Drag DOM and interaction initialize after browser mount. Disabling dragging or unmounting releases listeners, and the last card to unmount removes the shared container. The component inherits Card props and slots. Its entrance transition honors reduced motion.

## Interactive example {#交互示例}

<AdminExample path="/draggable-card" title="Drag a card within its movement boundary" />

::: details View example source
<<< @/../admin/src/views/demo/draggable-card.tsx
:::

```tsx
import { RDraggableCard } from '@/components'

export const renderFloatingHelp = () => (
  <RDraggableCard
    title="Help"
    width={320}
    defaultPosition="bottom-right"
    padding={{ x: 24, y: 24 }}
  >
    Drag the header to move this card.
  </RDraggableCard>
)
```

[Component source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RDraggableCard/DraggableCard.tsx)
