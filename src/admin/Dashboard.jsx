import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { createProject, fetchCodes, fetchProjects } from "../utils/api.js";
import ImportCSV from "../admin/ImportCSV";
import { FiPlus } from "react-icons/fi";
import {
  AiOutlineEye,
  AiOutlineUpload,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [codes, setCodes] = useState([]);
  const [view, setView] = useState("table");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [claimedCount, setClaimedCount] = useState(0);
  const [unclaimedCount, setUnclaimedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchProjects();
        setProjects(res.projects || []);
        if (res.projects && res.projects.length > 0) {
          setSelectedProject(res.projects[0].slug);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    };


    loadProjects();
  }, []);


  useEffect(() => {
    if (selectedProject) {
      fetchCodes(selectedProject)
        .then((res) => {
          const codes = res.codes || [];
          setCodes(codes);


          const claimed = codes.filter(c => c.claimed).length;
          const total = codes.length;
          const unclaimed = total - claimed;


          setClaimedCount(claimed);
          setUnclaimedCount(unclaimed);
          setTotalCount(total);
        })
        .catch((err) => {
          console.error("Failed to fetch codes:", err);
          setCodes([]);
        });
    }
  }, [selectedProject]);


  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const { slug } = await createProject(newProjectName);
      const newProj = { name: newProjectName, slug };
      const updatedProjects = [...projects, newProj];
      setProjects(updatedProjects);
      setNewProjectName("");
      setShowCreateInput(false);
      setSelectedProject(slug);
    } catch (err) {
      console.error("Create project failed:", err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };


  const renderProjectMenu = () => (
    <>
      {projects.map((proj) => (
        <div key={proj.slug} className={styles.projectItem}>
          <button
            className={`${styles.projectButton} ${
              selectedProject === proj.slug ? styles.active : ""
            }`}
            onClick={() => {
              setSelectedProject(proj.slug);
              setView("table");
            }}
          >
            {proj.name}
          </button>
          {selectedProject === proj.slug && (
            <div className={styles.subButtons}>
              <button
                onClick={() => setView("upload")}
                className={styles.subBtn}
              >
                <AiOutlineUpload size={16} />
                Upload CSV
              </button>
              <button
                onClick={() => setView("table")}
                className={styles.subBtn}
              >
                <AiOutlineEye size={16} />
                View Codes
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );


  return (
    <div className={styles.dashboardContainer}>
      <aside
        className={`${styles.sidebar} ${
          sidebarCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.topBar}>
          <button
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <AiOutlineArrowLeft size={18} />
          </button>
          {!sidebarCollapsed && (
            <button
              className={styles.greenButton}
              onClick={() => setShowCreateInput(true)}
            >
              <FiPlus size={16} />
              Create
            </button>
          )}
        </div>


        {!sidebarCollapsed && (
          <div className={styles.projectList}>
            <h3>Projects</h3>
            {renderProjectMenu()}
          </div>
        )}


        {!sidebarCollapsed && (
          <div style={{ marginTop: "670px" }}>
            <button className={styles.greenButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </aside>


      <main className={styles.mainContent}>
        {showCreateInput ? (
          <div className={styles.createForm}>
            <h2>Name of Project</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
              className={styles.input}
            />
            <button
              className={styles.greenButton}
              onClick={handleCreateProject}
            >
              Create
            </button>
          </div>
        ) : view === "upload" ? (
          <ImportCSV projectSlug={selectedProject} />
        ) : (
          <div className={styles.codeTable}>
            <h2>Codes for {selectedProject}</h2>
            <p>
              <strong>Total:</strong> {totalCount} |{" "}
              <strong>Claimed:</strong> {claimedCount} |{" "}
              <strong>Unclaimed:</strong> {unclaimedCount}
            </p>


            {codes.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discord Username</th>
                    <th>Redeemed</th>
                    <th>Discord ID</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code) => (
                    <tr key={code.id}>
                      <td>{code.code || "-"}</td>
                      <td>{code.username || "-"}</td>
                      <td>{code.redeemed ? "✅" : "❌"}</td>
                      <td>{code.discord_id || "-"}</td>
                      <td>{code.updated_at || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No codes available</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};


export default Dashboard;
