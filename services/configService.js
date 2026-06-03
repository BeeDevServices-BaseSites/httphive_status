const JSON_URL = process.env.MONITOR_CONFIG_URL

async function getMonitorConfig() {
  const response = await fetch(JSON_URL);

  if (!response.ok) {
    throw new Error(`Monitor config request failed: ${response.status}`);
  }

  return response.json();
}

module.exports = {
  getMonitorConfig
};