const express = require("express");
const router = express.Router();

const { getUptimeRobotMonitors } = require("../services/uptimeRobotService");
const { getMonitorConfig } = require("../services/configService");

router.get("/", async (req, res) => {
    try {
        const config = await getMonitorConfig();
        const uptimeMonitors = await getUptimeRobotMonitors();

        const mergedMonitors = config.monitors
            .filter((monitor) => monitor.is_active)
            .map((monitor) => {
                const liveData = uptimeMonitors.find(
                    (u) => Number(u.id) === Number(monitor.uptimeRobotId)
                );

                return {
                    ...monitor,
                    live: liveData || null,
                    status: liveData?.status || "UNKNOWN",
                    url: liveData?.url || null,
                    lastIncident: liveData?.lastIncident || null
                };
            });

        console.log("CONFIG GROUPS:", config.groups);
        console.log("CONFIG SERVICE GROUPS:", config.serviceGroups);
        console.log("CONFIG MONITORS:", config.monitors);
        console.log("MERGED MONITORS:", mergedMonitors);
        res.render("index", {
            title: "HTTPHive Status",
            groups: config.groups,
            serviceGroups: config.serviceGroups,
            monitors: mergedMonitors,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error(error);

        res.status(500).render("index", {
            title: "HTTPHive Status",
            groups: [],
            serviceGroups: [],
            monitors: [],
            error: "Unable to load status data right now.",
            lastUpdated: new Date()
        });
    }
});

module.exports = router;