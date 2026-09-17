import { Container } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";

function DefaultLayout() {
  return (
    <>
      <NavHeader />
      <Container fluid className="p-0">
        <Outlet />
      </Container>
    </>
  );
}

export default DefaultLayout;
