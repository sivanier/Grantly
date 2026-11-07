/** Sanitize the persisted ID list while leaving unrelated browser storage untouched. */
export function normalizeSavedScholarshipIds(value) {
  return Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === 'string' && id.trim()).map((id) => id.trim()))] : []
}

export function resolveSavedScholarships(ids, scholarships) {
  const validIds = new Set(normalizeSavedScholarshipIds(ids))
  return (Array.isArray(scholarships) ? scholarships : []).filter((scholarship) => scholarship && validIds.has(scholarship.id))
}

export function getUnavailableSavedIds(ids, scholarships) {
  const knownIds = new Set((Array.isArray(scholarships) ? scholarships : []).map((scholarship) => scholarship?.id).filter(Boolean))
  return normalizeSavedScholarshipIds(ids).filter((id) => !knownIds.has(id))
}
