import { Form } from "react-bootstrap";
import createCrudPanel from "./CrudPanel";

const PostsPanel = createCrudPanel({
  resource: "posts",
  title: "Posts",
  emptyItem: { title: "", author: "" },
  searchField: "title",
  pageSize: 5,
  columns: [
    { key: "id", label: "#", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author", sortable: true },
  ],
  renderForm: (value, onChange) => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Author</Form.Label>
        <Form.Control
          value={value.author}
          onChange={(e) => onChange({ author: e.target.value })}
        />
      </Form.Group>
    </>
  ),
});

export default PostsPanel;
