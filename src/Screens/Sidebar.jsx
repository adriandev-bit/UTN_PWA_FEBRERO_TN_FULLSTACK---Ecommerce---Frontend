import React, { useEffect, useState } from "react";
import './css/Sidebar.css';

const Sidebar = ({ setSelectedChannel }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newChannelName, setNewChannelName] = useState("");

  // Obtener workspaces
  const fetchWorkspaces = async () => {
    try {
      const token = sessionStorage.getItem("authorization_token");
      if (!token) {
        setError("No hay un token de autenticación");
        return;
      }

      const response = await fetch("http://localhost:3000/api/workspaces", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los workspaces");
      }

      const data = await response.json();
      setWorkspaces(data.data?.workspaces || []);
    } catch (error) {
      console.error("Error al obtener los workspaces:", error);
      setError(error.message);
    }
  };

  // Obtener canales del workspace seleccionado
  const fetchChannels = async (workspaceId) => {
    try {
      const token = sessionStorage.getItem("authorization_token");
      const response = await fetch(
        `http://localhost:3000/api/channels/workspace/${workspaceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los canales");
      }

      const data = await response.json();
      setChannels(data.data?.channels || []);
    } catch (error) {
      console.error("Error al obtener los canales:", error);
      setChannels([]);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Seleccionar workspace
  const handleWorkspaceClick = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
    fetchChannels(workspaceId);
  };

  // Seleccionar canal
  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  };

  // Crear nuevo workspace
  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    try {
      const token = sessionStorage.getItem("authorization_token");
      const response = await fetch("http://localhost:3000/api/workspaces", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newWorkspaceName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear workspace");
      }

      setNewWorkspaceName("");
      fetchWorkspaces();
    } catch (error) {
      console.error("Error al crear workspace:", error);
      setError(error.message);
    }
  };

  // Eliminar workspace
  const handleDeleteWorkspace = async (workspaceId) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este workspace?");
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("authorization_token");
      const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el workspace");
      }

      setWorkspaces(workspaces.filter((workspace) => workspace._id !== workspaceId));
      if (selectedWorkspace === workspaceId) {
        setSelectedWorkspace(null);
        setChannels([]);
      }
    } catch (error) {
      console.error("Error al eliminar workspace:", error);
      setError(error.message);
    }
  };

  // Crear un nuevo canal dentro del workspace seleccionado
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) {
      alert("Ingresa un nombre para el canal");
      return;
    }

    if (!selectedWorkspace) {
      alert("Selecciona un workspace primero");
      return;
    }

    try {
      const token = sessionStorage.getItem("authorization_token");
      const response = await fetch(
        `http://localhost:3000/api/channels/${selectedWorkspace}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newChannelName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear canal");
      }

      setNewChannelName("");
      fetchChannels(selectedWorkspace);
    } catch (error) {
      console.error("Error al crear canal:", error);
      alert(error.message);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este canal?");
    if (!confirmDelete) return;
  
    try {
      const token = sessionStorage.getItem("authorization_token");
      const response = await fetch(
        `http://localhost:3000/api/channels/${channelId}`, // Ajusta la URL si es necesario
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el canal");
      }
  
      // Eliminar el canal de la lista en el frontend
      setChannels(channels.filter((channel) => channel._id !== channelId));
      alert("Canal eliminado");
    } catch (error) {
      console.error("Error al eliminar canal:", error);
      alert("Hubo un error al intentar eliminar el canal");
    }
  };

  return (
    <div className="sidebar">
      <h2>Workspaces</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="workspace-input">
        <input
          type="text"
          placeholder="Nuevo workspace"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
        />
        <button onClick={handleCreateWorkspace}>➕</button>
      </div>

      <ul>
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <li key={workspace._id}>
              <button onClick={() => handleWorkspaceClick(workspace._id)}>
                {workspace.name}
              </button>
              <button
                className="delete"
                onClick={() => handleDeleteWorkspace(workspace._id)}
              >
                ❌
              </button>

              {selectedWorkspace === workspace._id && (
                <div>
                  <h3>Canales</h3>
                  <ul>
                    {channels.length > 0 ? (
                      channels.map((channel) => (
                        <li key={channel._id}>
                          <button onClick={() => handleChannelClick(channel._id)}>
                            {channel.name}
                          </button>
                          {/* Botón para eliminar el canal */}
                          <button
                            className="delete"
                            onClick={(e) => {
                              e.stopPropagation(); // Evita que se seleccione el canal al hacer clic en el botón de eliminar
                              handleDeleteChannel(channel._id);
                            }}
                          >
                            ❌
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>No hay canales disponibles</p>
                    )}
                  </ul>

                  {/* Formulario para agregar un nuevo canal */}
                  <input
                    type="text"
                    placeholder="Nuevo canal"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                  <button onClick={handleCreateChannel}>➕</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No tienes workspaces disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
