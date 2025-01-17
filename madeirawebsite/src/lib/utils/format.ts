export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  export function formatDateTime(date: string | Date) {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  export function formatPhoneNumber(phone: string) {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  export function formatMoney(amount: number) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }