const ISSUES_API_URL = process.env.ISSUES_API_URL;

async function getIssues() {
  const response = await fetch(ISSUES_API_URL);

  if (!response.ok) {
    throw new Error(`Issues API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.issues || [];
}

module.exports = {
  getIssues
};