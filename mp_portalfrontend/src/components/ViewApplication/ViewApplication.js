import React, { useEffect, useState } from "react";
import digitalsign from "../../assets/images/digi-signature/sign.png";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useParams } from "react-router-dom";
import api from "../../api";
// import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
// import Sidebar from "../Sidebar/Sidebar";

// import FooterAdmin from "../FooterAdmin/FooterAdmin";

const ViewApplication = () => {
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGrievance = async () => {
    try {
      const response = await api.get(`/grievances/${id}`);
      setGrievance(response.data);
    } catch (err) {
      setError("Failed to fetch grievance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievance();
    //eslint-disable-next-line
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!grievance) {
    return <div>No grievance data found</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* <HeaderAdmin />
      <Sidebar /> */}
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol class="breadcrumb mb-1">
                  <li class="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item" aria-current="page">
                    <Link to="/all-grievance-list">All Grievance List</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item active" aria-current="page">
                    Preview Grievance
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12">
              <div class="card custom-card">
                <div class="card-header d-md-flex d-block">
                  <div class="h5 mb-0 d-sm-flex d-bllock align-items-center">
                    <div class="ms-0 mt-sm-0 mt-2">
                      <div class="h6 fw-medium mb-0">
                        Inward No. :{" "}
                        <span class="text-primary">{grievance.inwardNo}</span>
                      </div>
                    </div>
                  </div>
                  <div class="ms-auto mt-md-0 mt-2">
                    <button
                      className="btn btn-sm fs-16 btn-primary1-gradient me-1"
                      onClick={handlePrint}
                    >
                      Print
                      <i className="ri-printer-line ms-1 align-middle d-inline-block"></i>
                    </button>{" "}
                  </div>
                </div>
                <div class="card-body">
                  <div class="row gy-3">
                    <div class="col-xl-6">
                      <div class="table-responsive">
                        <table class="table nowrap text-nowrap mt-4">
                          <thead>
                            <tr>
                              <th width="20%">
                                <b>Subject :</b>
                              </th>
                              <td>{grievance.subject}</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>
                                <b>Full Name :</b>
                              </th>
                              <td>{grievance.fullName}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Mobile No. :</b>
                              </th>
                              <td>{grievance.mobileNo}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Booth No. :</b>
                              </th>
                              <td>{grievance.boothNo}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Handled by :</b>
                              </th>
                              <td>{grievance.handledBy} (PA 01)</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Complaint Send to :</b>
                              </th>
                              <td>{grievance.complaintSentTo}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Issued Date :</b>
                              </th>
                              <td>
                                {new Date(grievance.date).toLocaleDateString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="table-responsive">
                        <table class="table nowrap text-nowrap mt-4">
                          <thead>
                            <tr>
                              <th width="20%">
                                <b>Application Status :</b>
                              </th>
                              <td>{grievance.applicationStatus}</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>
                                <b>Disctrict :</b>
                              </th>
                              <td>{grievance.district}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Taluka :</b>{" "}
                              </th>
                              <td>{grievance.taluka}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Village :</b>{" "}
                              </th>
                              <td>{grievance.village}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>City :</b>
                              </th>
                              <td>{grievance.city}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Pincode :</b>{" "}
                              </th>
                              <td>{grievance.pincode}</td>
                            </tr>
                            <tr>
                              <th>
                                <b>Whatsapp Group :</b>{" "}
                              </th>
                              <td>{grievance.whatsappGroup}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xl-12 mt-4 ms-3">
                        <label for="invoice-note" class="fw-bold mb-1 fs-14">
                          Remark :
                        </label>
                        <p>{grievance.remark}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 mt-4 ms-3">
                        <p class="fw-normal mb-1 fs-16">
                          MP's Digital Signature{" "}
                        </p>
                        <img
                          width="150"
                          class="border mt-2"
                          src={digitalsign}
                          alt="digi sign"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <FooterAdmin /> */}
    </>
  );
};

export default ViewApplication;
