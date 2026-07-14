import { Container, Nav, Navbar, Tab, Tabs } from "react-bootstrap";
import CommentsPanel from "./components/CommentsPanel";
import DataPanel from "./components/DataPanel";
import PostsPanel from "./components/PostsPanel";
import ProfilePanel from "./components/ProfilePanel";

function App() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#">vite-plugin-json-server</Navbar.Brand>
          <Nav>
            <Nav.Link
              href="https://github.com/yracnet/vite-plugin-json-server"
              target="_blank"
            >
              GitHub
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Tabs defaultActiveKey="posts" className="mb-3">
          <Tab eventKey="posts" title="Posts">
            <PostsPanel />
          </Tab>
          <Tab eventKey="comments" title="Comments">
            <CommentsPanel />
          </Tab>
          <Tab eventKey="profile" title="Profile">
            <ProfilePanel />
          </Tab>
          <Tab eventKey="data" title="Data">
            <DataPanel />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default App;
