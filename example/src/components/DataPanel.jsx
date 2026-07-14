import { Col, Form, Row } from "react-bootstrap";
import createCrudPanel from "./CrudPanel";

const patchData = (value, onChange, patch) =>
  onChange({ data: { ...value.data, ...patch } });

const patchSettings = (value, onChange, patch) =>
  patchData(value, onChange, {
    settings: { ...value.data.settings, ...patch },
  });

const DataPanel = createCrudPanel({
  resource: "data",
  title: "Data",
  emptyItem: {
    data: {
      name: "",
      role: "viewer",
      settings: { theme: "light", language: "en" },
    },
  },
  pageSize: 5,
  columns: [
    { key: "id", label: "#", sortable: true },
    { key: "name", label: "Name", render: (item) => item.data?.name },
    { key: "role", label: "Role", render: (item) => item.data?.role },
    {
      key: "theme",
      label: "Theme",
      render: (item) => item.data?.settings?.theme,
    },
    {
      key: "language",
      label: "Language",
      render: (item) => item.data?.settings?.language,
    },
  ],
  renderForm: (value, onChange) => {
    const { name = "", role = "viewer", settings = {} } = value.data ?? {};
    const { theme = "light", language = "en" } = settings;

    return (
      <>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => patchData(value, onChange, { name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            value={role}
            onChange={(e) => patchData(value, onChange, { role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </Form.Select>
        </Form.Group>

        <Row>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Theme</Form.Label>
              <Form.Select
                value={theme}
                onChange={(e) =>
                  patchSettings(value, onChange, { theme: e.target.value })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={language}
                onChange={(e) =>
                  patchSettings(value, onChange, { language: e.target.value })
                }
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  },
});

export default DataPanel;
