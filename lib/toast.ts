// Simple toast implementation
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message)
    // In a real app, you'd use a proper toast library like react-hot-toast or sonner
    alert(`Success: ${message}`)
  },
  error: (message: string) => {
    console.error('❌ Error:', message)
    alert(`Error: ${message}`)
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message)
    alert(`Info: ${message}`)
  }
}