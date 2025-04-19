import { useCallback, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";

import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from "@coreui/react-chartjs";

import { formatRevenue } from "../../../utils/Formatter";

import DashboardService from "../../../services/admin/DashboardService";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook để điều hướng
  const currentYear = new Date().getFullYear();

  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalVipUsers: 0,
    totalMovies: 0,
    totalGenres: 0,
    totalRevenue: 0,
  });

  const [monthlyStatistics, setMonthlyStatistics] = useState([]);
  const [genreStatistics, setGenreStatistics] = useState([]);
  const [movieRatingStatistics, setMovieRatingStatistics] = useState([]);
  const [movieViewedStatistics, setMovieViewedStatistics] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const cards = [
    {
      title: "Tổng số người dùng",
      value: statistics.totalUsers,
      icon: "bi bi-people-fill",
      color: "primary",
      footer: "Tăng 10% so với tháng trước",
      to: "/admin/users",
    },
    {
      title: "Tổng số người dùng VIP",
      value: statistics.totalVipUsers,
      icon: "bi bi-gem",
      color: "danger",
      footer: "VIP chiếm 28% tổng người dùng",
      to: "/admin/vips/vipMembers",
    },
    {
      title: "Tổng số bộ phim",
      value: statistics.totalMovies,
      icon: "bi bi-camera-reels-fill",
      color: "success",
      footer: "10.000 lượt xem mỗi ngày",
      to: "/admin/movies/movies",
    },
    {
      title: "Tổng doanh thu",
      value: formatRevenue(statistics.totalRevenue),
      icon: "bi bi-cash-coin",
      color: "warning",
      footer: "Doanh thu tăng 12% trong tháng",
      to: "/admin/vips/vipMembers",
    },
  ];
  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.getDashboardStatistics();
      setStatistics(data);
      const monthlyData = await DashboardService.getMonthlyStatistics(
        currentYear
      );
      setMonthlyStatistics(monthlyData);
      const genreData = await DashboardService.getGenreStatistics();
      setGenreStatistics(genreData);
      const movieRatingData = await DashboardService.getTopMovieRatings(5);
      setMovieRatingStatistics(movieRatingData);
      const movieViewedData = await DashboardService.getTopViewedMovies(5);
      setMovieViewedStatistics(movieViewedData);
      const recentActivityData = await DashboardService.getRecentActivities(10);
      setRecentActivities(recentActivityData);
    } catch (error) {
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const lineChartData = monthlyStatistics.map((item) => ({
    month: item.month,
    totalUsers: item.totalUsers,
    vipUsers: item.vipUsers,
  }));

  const pieChartData = genreStatistics.map((item) => ({
    genre: item.genre,
    movieCount: item.movieCount,
  }));

  const barChartData = movieViewedStatistics.map((item) => ({
    movieName: item.movieName,
    totalViews: item.totalViews,
  }));

  console.log(recentActivities);
  return (
    <>
      <Helmet>
        <title>Dashboard - Star Movie</title>
      </Helmet>

      <section className="row m-0 p-0">
        <Container fluid className="p-0">
          <Row className="mb-2 mb-md-3 mt-4 mt-md-2 py-2 py-md-0">
            <h5 className="fw-bold text-uppercase" style={{ color: "#E4E4E7" }}>
              Bảng điều khiển
            </h5>
          </Row>
          {error && (
            <Row>
              <Col>
                <Alert variant="danger">{error}</Alert>
              </Col>
            </Row>
          )}
          <Row>
            {/* Card show các thông tin hệ thống */}
            {cards.map((card, index) => (
              <Col md={3} className="mb-4" key={index}>
                <Card
                  className="shadow-lg border-0 hover-scale h-100"
                  onClick={() => navigate(card.to)}
                  style={{ cursor: "pointer", minHeight: "150px" }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className={`mb-0 text-${card.color}`}>
                          {card.title}
                        </p>
                        {isLoading ? (
                          <Skeleton height={24} width={80} />
                        ) : (
                          <h4 className={`fw-bold text-${card.color} mb-0`}>
                            {card.value}
                          </h4>
                        )}
                      </div>
                      <i className={`${card.icon} fs-3 text-${card.color}`}></i>
                    </div>
                  </Card.Body>
                  <div
                    className={`bg-${card.color} text-white p-3 d-flex justify-content-between align-items-center rounded-bottom`}
                  >
                    <span>{card.footer}</span>
                    <i className="bi bi-graph-up"></i>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Chart */}

          <CRow>
            <CCol xs={6} className="mb-4">
              <CCard className="mb-4">
                <CCardHeader>
                  Thống kê người dùng đăng kí theo tháng
                </CCardHeader>
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: lineChartData.map((item) => item.month),
                      datasets: [
                        {
                          label: "Số người dùng",
                          backgroundColor: "rgba(0, 123, 255, 0.2)",
                          borderColor: "rgba(0, 123, 255, 1)",
                          pointBackgroundColor: "rgba(0, 123, 255, 1)",
                          pointBorderColor: "#fff",
                          data: lineChartData.map((item) => item.totalUsers),
                        },
                        {
                          label: "Số người dùng VIP",
                          backgroundColor: "rgba(40, 167, 69, 0.2)",
                          borderColor: "rgba(40, 167, 69, 1)",
                          pointBackgroundColor: "rgba(40, 167, 69, 1)",
                          pointBorderColor: "#fff",
                          data: lineChartData.map((item) => item.vipUsers),
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          ticks: {
                            stepSize: 1,
                            callback: function (value) {
                              if (Number.isInteger(value)) {
                                return value;
                              }
                            },
                          },
                          beginAtZero: true, // bắt đầu từ 0
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
              <CCard className="mb-4">
                <CCardHeader>Top phim có lượt xem cao nhất</CCardHeader>
                <CCardBody>
                  <CChartBar
                    data={{
                      labels: barChartData.map((item) => item.movieName),
                      datasets: [
                        {
                          label: "Lượt xem",
                          backgroundColor: "#41B883",
                          data: barChartData.map((item) => item.totalViews),
                        },
                      ],
                    }}
                    labels="months"
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Số lượng phim theo từng thể loại</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: pieChartData.map((item) => item.genre),
                      datasets: [
                        {
                          backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
                          data: pieChartData.map((item) => item.movieCount),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <Row className="mb-4">
            <Col md={12} lg={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                  Hoạt động gần đây
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    {isLoading ? (
                      <>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={100} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={100} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={100} height={20} />
                        </li>
                      </>
                    ) : recentActivities.length === 0 ? (
                      <li className="text-muted py-2">
                        Không có hoạt động nào gần đây.
                      </li>
                    ) : (
                      recentActivities.map((activity, index) => (
                        <li
                          key={index}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >
                          <span className="d-flex align-items-center">
                            <i
                              className={`${activity.icon} text-primary me-2`}
                            ></i>
                            {activity.description}{" "}
                            {activity.activityType === "Review" ? (
                              <i className="bi bi-star-fill text-warning"></i>
                            ) : (
                              ""
                            )}
                          </span>
                          <small className="text-muted text-nowrap ms-2">
                            {activity.relativeTime}
                          </small>
                        </li>
                      ))
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                  Top phim đươc được đánh giá cao nhất
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    {isLoading ? (
                      // Hiển thị skeleton khi dữ liệu đang tải
                      <>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={50} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={50} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={50} height={20} />
                        </li>
                      </>
                    ) : (
                      movieRatingStatistics.map((movie, index) => (
                        <li
                          key={index}
                          className="d-flex align-items-center py-3 border-bottom"
                        >
                          <img
                            src={movie.posterUrl}
                            alt={movie.movieName}
                            style={{
                              width: "50px",
                              height: "70px",
                              objectFit: "cover",
                            }}
                            className="me-3 rounded"
                          />
                          <div className="flex-grow-1">
                            <strong>{movie.movieName}</strong>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.9rem" }}
                            >
                              <i className="bi bi-star-fill text-warning"></i>{" "}
                              {movie.averageRating} ({movie.totalRatings} đánh
                              giá)
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Dashboard;
