import axios from 'axios';

const BASE_URL = "http://140.245.5.226:3000";

const handler = async (req, res) => {
  const endpoint = req.query.endpoint || req.params?.endpoint || req.url.split("/").pop();
  const method = req.method.toLowerCase();

  const urlMap = {
    "server-status": "/",
    "get-incident": "/api/v1/incident/get-incident",
    "new-incident": "/api/v1/incident/new-incident",
    "explicit-new-incident": "/api/v1/incident/explicit-new-incident",
    "resolve-incident": "/api/v1/incident/incident-resolve",
    "open-incidents": "/api/v1/incident/incident-open"
  };

  const targetPath = urlMap[endpoint];
  if (!targetPath) return res.status(404).json({ error: "Invalid endpoint" });

  try {
    const axiosConfig = {
      method,
      url: `${BASE_URL}${targetPath}`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    };
    if (method === "get") axiosConfig.params = req.query;
    else axiosConfig.data = req.body;

    const response = await axios(axiosConfig);
    return res.status(response.status).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message || "Proxy error"
    });
  }
};

export default handler;
