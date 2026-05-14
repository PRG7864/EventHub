export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

export const formatDate = (value, options = {}) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  }).format(new Date(value))

export const formatDateTime = (value) =>
  formatDate(value, {
    hour: 'numeric',
    minute: '2-digit'
  })
