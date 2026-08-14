# MCP Tools Reference

Complete reference for all 13 tools provided by OpenBoard.

---

## Board Management Tools

### `list_boards`

Discover and list whiteboards available in OpenBoard.

- **Parameters:**
  - `filter` _(string, optional)_: Preset filter — `"all"` (default), `"recent"`, `"favorites"`, `"trash"`.
  - `searchQuery` _(string, optional)_: Search keyword for title or description.
  - `favoritesOnly` _(boolean, optional)_: Legacy filter for favorites.
  - `deletedOnly` _(boolean, optional)_: Legacy filter for Trash.
- **Returns:** Array of `{ id, name, description, updatedAt, favorite }`.

---

### `create_board`

Create a new whiteboard board.

- **Parameters:**
  - `name` _(string, optional)_: Title for the board (defaults to `"Untitled Board"`).
  - `description` _(string, optional)_: Optional summary.
  - `favorite` _(boolean, optional)_: Mark as favorite bookmark.
- **Returns:** `{ id, name, description, createdAt, updatedAt, favorite }`.

---

### `get_board`

Get metadata and bounding box summary of a board.

- **Parameters:**
  - `board_id` _(string, required)_: The unique ID of the board.
- **Returns:** `{ id, name, description, createdAt, updatedAt, favorite, shapesCount, bounds }`.

---

### `rename_board`

Rename an existing whiteboard.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `name` _(string, required)_: New name.
- **Returns:** `{ board_id, name, updatedAt }`.

---

### `duplicate_board`

Clone an entire whiteboard and its canvas contents.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `name` _(string, optional)_: Custom name for duplicate.
- **Returns:** `{ id, name, sourceBoardId, createdAt }`.

---

### `favorite_board`

Set or toggle favorite bookmark status.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `favorite` _(boolean, optional)_: Explicit boolean state. If omitted, toggles current state.
- **Returns:** `{ board_id, name, favorite }`.

---

### `restore_board`

Restore a soft-deleted board from Trash.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
- **Returns:** `{ board_id, restored: true }`.

---

### `delete_board`

Soft-delete a whiteboard (moves to Trash).

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
- **Returns:** `{ board_id, deleted: true }`.

---

## Canvas & Vision Tools

### `get_canvas_state`

Inspect semantic shapes, coordinates, dimensions, bounds, and arrow connections.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
- **Returns:**
  ```json
  {
    "boardId": "board_123",
    "name": "Payment Topology",
    "shapesCount": 3,
    "bounds": { "minX": 100, "minY": 100, "maxX": 580, "maxY": 180, "width": 480, "height": 80 },
    "shapes": [
      {
        "id": "shape:api",
        "type": "geo",
        "geo": "rectangle",
        "x": 100,
        "y": 100,
        "w": 180,
        "h": 80,
        "text": "API Server",
        "color": "blue",
        "fill": "semi"
      },
      {
        "id": "shape:db",
        "type": "geo",
        "geo": "rectangle",
        "x": 400,
        "y": 100,
        "w": 180,
        "h": 80,
        "text": "PostgreSQL",
        "color": "green",
        "fill": "semi"
      },
      {
        "id": "shape:arrow_1",
        "type": "arrow",
        "from": "shape:api",
        "to": "shape:db",
        "text": "queries"
      }
    ]
  }
  ```

---

### `get_canvas_screenshot`

Capture a headless vector SVG visual inspection screenshot.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `theme` _(string, optional)_: `"light"` (default) or `"dark"`.
  - `padding` _(number, optional)_: Padding in pixels (default: 40).
  - `background` _(boolean, optional)_: Include grid dot background (default: true).
  - `viewport` _(object, optional)_: Custom `{ x, y, width, height }`.
- **Returns:** Standard MCP image content block (`image/svg+xml`) with base64 data and SVG text string.

---

### `create_shapes`

Batch create shapes on a board.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `shapes` _(array, required)_: Array of shape definitions:
    - `id` _(string, optional)_: Custom shape ID (e.g. `"auth_service"`).
    - `type` _(string)_: `"geo"`, `"note"`, `"text"`, `"arrow"`, `"line"`, `"frame"`.
    - `x`, `y` _(number, required)_: Coordinates.
    - `w`, `h` _(number, optional)_: Dimensions.
    - `geo` _(string, optional)_: `"rectangle"`, `"ellipse"`, `"triangle"`, `"diamond"`, `"cloud"`, `"star"`.
    - `text` _(string, optional)_: Label or text content.
    - `color` _(string, optional)_: `"black"`, `"blue"`, `"green"`, `"red"`, `"yellow"`, `"violet"`, `"orange"`, `"grey"`.
    - `fill` _(string, optional)_: `"none"`, `"semi"`, `"solid"`, `"pattern"`.
    - `from` _(string, optional)_: For arrows: source shape ID.
    - `to` _(string, optional)_: For arrows: target shape ID.
    - `start` _(object `{ x, y }`, optional)_: For unbound arrows: start handle offset in pixels relative to `(x, y)`. Defaults to `{ "x": 0, "y": 0 }`.
    - `end` _(object `{ x, y }`, optional)_: For unbound arrows: end handle offset in pixels relative to `(x, y)`. Defaults to `{ "x": 120, "y": 0 }` (e.g. `{ "x": 0, "y": 160 }` for a vertical arrow).

---

### `update_shapes`

Batch update shape positions, dimensions, text, styles, start/end handle offsets, or arrow connections.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `shapes` _(array, required)_: Array of updates with `id`, `x`, `y`, `w`, `h`, `text`, `color`, `fill`, `geo`, `rotation`, `from`, `to`, `start`, `end`.

---

### `delete_shapes`

Delete shapes by ID and automatically clean up attached arrow bindings.

- **Parameters:**
  - `board_id` _(string, required)_: Target board ID.
  - `shape_ids` _(array of strings, required)_: List of shape IDs.
