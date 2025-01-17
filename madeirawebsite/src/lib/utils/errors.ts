export class AppError extends Error {
    constructor(
      message: string,
      public statusCode: number = 400,
      public code?: string
    ) {
      super(message)
      this.name = 'AppError'
    }
  }
  
  export function handleError(error: unknown) {
    console.error('Error:', error)
    
    if (error instanceof AppError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code
      }
    }
  
    if (error instanceof Error) {
      return {
        message: error.message,
        statusCode: 500
      }
    }
  
    return {
      message: 'Error desconocido',
      statusCode: 500
    }
  }