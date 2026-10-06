export const REPORT_STATUSES = {
  pending: { label: "À traiter", param: null },
  resolved: { label: "Traités", param: "traites" },
  rejected: { label: "Rejetés", param: "rejetes" },
};

export function reportStatusFromParam(param) {
  const match = Object.entries(REPORT_STATUSES).find(([, status]) => status.param === param);
  return match ? match[0] : "pending";
}

export function reportsHref(status) {
  const { param } = REPORT_STATUSES[status];
  return param ? `/admin/signalements?statut=${param}` : "/admin/signalements";
}
