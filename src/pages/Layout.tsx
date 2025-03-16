import { Link, Outlet } from "react-router-dom";

function Layout() {


  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin/list">
            Trang chủ
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/list">
                  Danh sách
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/add">
                  Thêm mới
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Đăng ký
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <Outlet/>
      </div>
    </div>
  );
}

export default Layout;
