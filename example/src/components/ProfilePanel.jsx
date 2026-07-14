import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { apiGet, apiUpdate } from "../api";

const ProfilePanel = () => {
  const [profile, setProfile] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    apiGet("profile", 1)
      .then((data) => {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setBio(data.bio);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;
    const updated = await apiUpdate("profile", profile.id, {
      ...profile,
      name,
      email,
      bio,
    });
    setProfile(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <>
      <h4 className="mb-3">Profile</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <Card body className="w-50">
          <Form onSubmit={onSave}>
            <Row className="g-2">
              <Col sm={12}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
              <Col sm={12}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
              <Col sm={12}>
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Col>
              <Col sm={12}>
                <Button type="submit" className="w-100 mt-2">
                  Save
                </Button>
              </Col>
            </Row>
            {saved && (
              <Alert variant="success" className="mt-3 mb-0 py-1">
                Saved!
              </Alert>
            )}
          </Form>
        </Card>
      )}
    </>
  );
};

export default ProfilePanel;
