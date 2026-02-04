import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { productsService } from '../services/products.service';
import { salesService } from '../services/sales.service';
import { socketService } from '../services/socket.service';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types/product.types';

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    loadProducts();
    socketService.connect();

    socketService.on('stock-updated', handleStockUpdate);

    return () => {
      socketService.off('stock-updated', handleStockUpdate);
    };
  }, []);

  const handleStockUpdate = (data: { productId: number; stock: number }) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === data.productId ? { ...p, stock: data.stock } : p))
    );
  };

  const loadProducts = async () => {
    try {
      const data = await productsService.getActive();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }

    const cartItem = items.find((item) => item.product.id === product.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (currentQuantity + 1 > product.stock) {
      alert(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    addItem(product, 1);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setProcessingPayment(true);

    try {
      const saleData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      await salesService.create(saleData);
      clearCart();
      setShowSuccessModal(true);
      await loadProducts();

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al procesar la venta');
    } finally {
      setProcessingPayment(false);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Cargando productos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Productos Disponibles</h2>
              
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {categories.length > 0 && (
              <div className="mb-6 flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === null
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todos
                </button>
                {Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((category) => (
                  <button
                    key={category?.id}
                    onClick={() => setSelectedCategory(category?.id || null)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category?.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category?.name}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-4xl">☕</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-orange-600 font-bold mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron productos
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Carrito ({getItemCount()})
            </h2>

            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                El carrito está vacío
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity + 1 > item.product.stock) {
                              alert('Stock insuficiente');
                              return;
                            }
                            updateQuantity(item.product.id, item.quantity + 1);
                          }}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processingPayment}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                  {processingPayment ? 'Procesando...' : 'Finalizar Venta'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Limpiar Carrito
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-green-500"></div>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">¡Venta Exitosa!</h3>
            <p className="text-gray-600">La venta se ha procesado correctamente</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
