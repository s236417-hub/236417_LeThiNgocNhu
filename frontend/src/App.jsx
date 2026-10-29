
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const emptyFood = {
  foodId: '',
  name: '',
  category: 'Món chính',
  cuisine: 'Việt Nam',
  ingredients: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: '',
}

function App() {
  const [foods, setFoods] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyFood)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadFoods(keyword = search) {
    setLoading(true)
    setError('')
    try {
      const url = new URL(`${API_URL}/api/foods`)
      if (keyword.trim()) url.searchParams.set('search', keyword.trim())
      const response = await fetch(url)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Không thể tải danh sách món ăn')
      setFoods(data)
    } catch (err) {
      setError(`Không thể kết nối API. Hãy kiểm tra Backend đang chạy. (${err.message})`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoods('')
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function resetForm() {
    setForm(emptyFood)
    setEditingId(null)
  }

  function handleEdit(food) {
    setEditingId(food._id)
    setForm({
      foodId: food.foodId || '',
      name: food.name || '',
      category: food.category || 'Món chính',
      cuisine: food.cuisine || '',
      ingredients: (food.ingredients || []).join(', '),
      price: food.price ?? '',
      quantity: food.quantity ?? '',
      description: food.description || '',
      imageUrl: food.imageUrl || '',
    })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const payload = {
      ...form,
      ingredients: form.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/api/foods/${editingId}` : `${API_URL}/api/foods`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Không thể lưu món ăn')

      setMessage(editingId ? 'Cập nhật món ăn thành công!' : 'Thêm món ăn thành công!')
      resetForm()
      setSearch('')
      await loadFoods('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(food) {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${food.name}" không?`)) return

    setError('')
    setMessage('')
    try {
      const response = await fetch(`${API_URL}/api/foods/${food._id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Không thể xóa món ăn')

      setMessage(`Đã xóa món "${food.name}" thành công!`)
      await loadFoods()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-icon">🍜</div>
        <p className="eyebrow">HỆ THỐNG QUẢN LÝ MÓN ĂN</p>
        <h1>Quản lý thực đơn <span>thật dễ dàng</span></h1>
        <p className="subtitle">Quản lý món ăn, nguyên liệu, giá bán và số lượng tồn kho tại một nơi.</p>
        <div className="hero-stats">
          <div><strong>{foods.length}</strong><span>Món ăn hiển thị</span></div>
          <div><strong>CRUD</strong><span>Quản lý món ăn</span></div>
          <div><strong>Live</strong><span>Kết nối cơ sở dữ liệu</span></div>
        </div>
      </header>

      <section className="content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">QUẢN LÝ THỰC ĐƠN</p>
            <h2>{editingId ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2>
          </div>
          {editingId && <button className="btn btn-light" type="button" onClick={resetForm}>Hủy chỉnh sửa</button>}
        </div>

        <form className="food-form" onSubmit={handleSubmit}>
          <label>Mã món ăn *
            <input name="foodId" value={form.foodId} onChange={handleChange} placeholder="Ví dụ: F004" required disabled={Boolean(editingId)} />
          </label>
          <label>Tên món ăn *
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ví dụ: Cơm tấm" required />
          </label>
          <label>Danh mục *
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="Món chính">Món chính</option>
              <option value="Đồ ăn nhanh">Đồ ăn nhanh</option>
              <option value="Món khai vị">Món khai vị</option>
              <option value="Tráng miệng">Tráng miệng</option>
              <option value="Đồ uống">Đồ uống</option>
              <option value="Súp">Súp</option>
              <option value="Khác">Khác</option>
            </select>
          </label>
          <label>Ẩm thực *
            <input name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Ví dụ: Việt Nam" required />
          </label>
          <label>Giá bán (VNĐ) *
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="50000" required />
          </label>
          <label>Số lượng *
            <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="20" required />
          </label>
          <label className="full-width">Nguyên liệu (phân cách bằng dấu phẩy)
            <input name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Thịt bò, bánh phở, rau thơm" />
          </label>
          <label className="full-width">Đường dẫn hình ảnh
            <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/mon-an.jpg" />
          </label>
          <label className="full-width">Mô tả món ăn
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Nhập mô tả món ăn..." rows="3" />
          </label>
          <button className="btn btn-primary full-width" type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : '+ Thêm món ăn'}
          </button>
        </form>

        {message && <p className="notice success" role="status">{message}</p>}
        {error && <p className="notice error" role="alert">{error}</p>}

        <div className="section-heading menu-heading">
          <div>
            <p className="eyebrow">DANH SÁCH MÓN ĂN</p>
            <h2>Thực đơn <span className="count">{foods.length}</span></h2>
          </div>
          <button className="btn btn-light" onClick={() => loadFoods()} type="button">↻ Làm mới</button>
        </div>

        <form className="search-bar" onSubmit={(event) => { event.preventDefault(); loadFoods(search) }}>
          <span>⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, mã món, danh mục hoặc ẩm thực..." />
          <button className="btn btn-primary" type="submit">Tìm kiếm</button>
          <button className="btn btn-light" type="button" onClick={() => { setSearch(''); loadFoods('') }}>Xóa lọc</button>
        </form>

        {loading ? (
          <div className="empty-state">Đang tải danh sách món ăn...</div>
        ) : foods.length === 0 ? (
          <div className="empty-state"><span>🥢</span><h3>Không tìm thấy món ăn</h3><p>Thử từ khóa khác hoặc thêm món ăn mới ở phía trên.</p></div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <article className="food-card" key={food._id}>
                {food.imageUrl ? (
                  <img className="food-image" src={food.imageUrl} alt={food.name} />
                ) : (
                  <div className="food-image-placeholder">🍽️</div>
                )}
                <div className="food-card-body">
                  <div className="food-card-top">
                    <span className="category">{food.category}</span>
                    <span className="food-id">{food.foodId}</span>
                  </div>
                  <h3>{food.name}</h3>
                  <p className="cuisine">{food.cuisine}</p>
                  {food.description && <p className="description">{food.description}</p>}
                  <p className="ingredients"><strong>Nguyên liệu:</strong> {(food.ingredients || []).join(', ') || 'Chưa cập nhật'}</p>
                  <div className="food-meta">
                    <div><span>Giá bán</span><strong>{Number(food.price).toLocaleString('vi-VN')} ₫</strong></div>
                    <div><span>Tồn kho</span><strong>{food.quantity}</strong></div>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-light" type="button" onClick={() => handleEdit(food)}>✎ Sửa</button>
                    <button className="btn btn-danger" type="button" onClick={() => handleDelete(food)}>Xóa</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>Hệ thống quản lý món ăn <span>•</span> React + Express + MongoDB Atlas</footer>
    </main>
  )
}

export default App
