const express = require("express");
const router = express.Router();

const { getUptimeRobotMonitors } = require("../services/uptimeRobotService");
const { getMonitorConfig } = require("../services/configService");
const { getIssues } = require("../services/issueService");

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

router.get("/issues", async (req, res) => {
    try {
        const issues = await getIssues();

        res.render("issues", {
            title: "Known Issues",
            issues
        });
    } catch (error) {
        console.error(error);

        res.render("issues", {
            title: "Known Issues",
            issues: [],
            error: "Unable to load reported issues right now."
        });
    }
});

router.get("/report", (req, res) => {
    res.render("report", {
        title: "Report an Issue",
        formUrl: process.env.REPORT_FORM_URL
    });
});

module.exports = router;