// Global utility functions and common functionality

// Format price to Vietnamese currency
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("token") !== null
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

// Logout function
async function logout() {
  try {
    // Call logout API to clear server-side cookies
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear client-side storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }
}

// Add to cart function
async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem("token")
  if (!token) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng")
    window.location.href = "/login"
    return
  }

  try {
    const response = await fetch("/api/v1/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: Number.parseInt(quantity),
      }),
    })

    if (response.ok) {
      alert("Đã thêm sản phẩm vào giỏ hàng!")
      updateCartCount()
    } else {
      const error = await response.json()
      alert(error.message || "Không thể thêm sản phẩm vào giỏ hàng")
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    alert("Có lỗi xảy ra. Vui lòng thử lại.")
  }
}

// Update cart count in navbar
async function updateCartCount() {
  const token = localStorage.getItem("token")
  if (!token) return

  try {
    const response = await fetch("/api/v1/cart/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const result = await response.json()
      const cart = result.data || result
      const count = cart && cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0

      const cartCountElement = document.getElementById("cartCount")
      if (cartCountElement) {
        cartCountElement.textContent = count
        cartCountElement.style.display = count > 0 ? "flex" : "none"
      }
    }
  } catch (error) {
    console.error("Error updating cart count:", error)
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Update cart count if user is logged in
  if (isLoggedIn()) {
    updateCartCount()
  }

  // Add authentication check for protected pages
  const protectedPaths = ["/profile", "/cart", "/orders", "/admin"]
  const currentPath = window.location.pathname

  if (protectedPaths.some((path) => currentPath.startsWith(path)) && !isLoggedIn()) {
    window.location.href = "/login"
  }
})

// Handle API errors globally
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason && event.reason.status === 401) {
    // Token expired or invalid
    logout()
  }
})
