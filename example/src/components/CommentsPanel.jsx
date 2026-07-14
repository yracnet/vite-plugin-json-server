import { Form } from "react-bootstrap";
import createCrudPanel from "./CrudPanel";

const CommentsPanel = createCrudPanel({
  resource: "comments",
  title: "Comments",
  emptyItem: { body: "", postId: 1 },
  searchField: "body",
  pageSize: 5,
  columns: [
    { key: "id", label: "#", sortable: true },
    { key: "body", label: "Comment", sortable: true },
    { key: "postId", label: "Post id", sortable: true },
  ],
  renderForm: (value, onChange) => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={value.body}
          onChange={(e) => onChange({ body: e.target.value })}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Post id</Form.Label>
        <Form.Control
          type="number"
          value={value.postId}
          onChange={(e) => onChange({ postId: Number(e.target.value) })}
        />
      </Form.Group>
    </>
  ),
});

export default CommentsPanel;
