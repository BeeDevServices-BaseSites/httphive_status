const UPTIME_URL = process.env.UPTIME_URL;
const API_KEY = process.env.UPTIMEROBOT_API_KEY;

async function getUptimeRobotMonitors() {
  const response = await fetch(UPTIME_URL, {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("UptimeRobot error:", response.status, errorText);
    throw new Error(`UptimeRobot request failed: ${response.status}`);
  }

  const data = await response.json();

  // v3 returns data; keeping fallback just in case
  return data.data || data.monitors || [];
}

module.exports = {
  getUptimeRobotMonitors
};