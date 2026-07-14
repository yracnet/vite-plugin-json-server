import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import { apiCreate, apiListPaged, apiRemove, apiUpdate } from "../api";

// createCrudPanel is a HOC-style factory: given contentTable (columns) and
// contentForm (renderForm), it returns a component with filtering, sorting,
// pagination and create/edit modals wired to json-server's query API.
const createCrudPanel = (config) => {
  const { resource, title, columns, emptyItem, renderForm, searchField, pageSize = 5 } =
    config;

  return function CrudPanel() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState();
    const [sortOrder, setSortOrder] = useState("asc");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [showModal, setShowModal] = useState(false);
    const [draft, setDraft] = useState(emptyItem);

    const load = () => {
      setLoading(true);
      apiListPaged(resource, {
        _page: page,
        _limit: pageSize,
        _sort: sortKey,
        _order: sortKey ? sortOrder : undefined,
        ...(searchField && search ? { [`${searchField}_like`]: search } : {}),
      })
        .then(({ data, total }) => {
          setItems(data);
          setTotal(total);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    };

    useEffect(load, [page, sortKey, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const onSort = (key) => {
      if (sortKey === key) {
        setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    };

    const onSearchSubmit = (e) => {
      e.preventDefault();
      setPage(1);
      load();
    };

    const openCreate = () => {
      setDraft(emptyItem);
      setShowModal(true);
    };

    const openEdit = (item) => {
      setDraft(item);
      setShowModal(true);
    };

    const onDelete = async (id) => {
      if (id === undefined) return;
      await apiRemove(resource, id);
      load();
    };

    const onSave = async () => {
      if (draft.id === undefined) {
        await apiCreate(resource, draft);
      } else {
        await apiUpdate(resource, draft.id, draft);
      }
      setShowModal(false);
      load();
    };

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{title}</h4>
          <Button size="sm" onClick={openCreate}>
            + New
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {searchField && (
          <Form onSubmit={onSearchSubmit} className="mb-3">
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by ${searchField}...`}
            />
          </Form>
        )}

        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      role={col.sortable ? "button" : undefined}
                      onClick={() => col.sortable && onSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key && (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : String(item[col.key] ?? "")}
                      </td>
                    ))}
                    <td className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              <Pagination.Prev
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item
                  key={p}
                  active={p === page}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </Pagination>
          </>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {draft.id === undefined ? `New ${title}` : `Edit ${title}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* contentForm */}
            {renderForm(draft, (patch) =>
              setDraft((current) => ({ ...current, ...patch }))
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
};

export default createCrudPanel;
