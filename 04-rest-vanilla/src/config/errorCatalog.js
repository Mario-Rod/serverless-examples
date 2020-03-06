module.exports = {
  internalError: { status: 500, code: 'internal_error' },
  AccessDeniedException: { status: 500, code: 'internal_error_access_denied' },
  apiNotFound: { status: 404, code: 'not_found' },
  resourceNotFound: { status: 404, code: 'resource_not_found' },
  ValidationError: { status: 400, code: 'client_input_validation', detail: true },
  missingID: { status: 400, code: 'missing_resource_id' },
}