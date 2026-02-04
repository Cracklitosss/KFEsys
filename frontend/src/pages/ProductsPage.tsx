import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductModal from '../components/ProductModal';
import CategoryModal from '../components/CategoryModal';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { Product, Category, CreateProductDto, CreateCategoryDto } from '../types/product.types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: CreateProductDto) => {
    await productsService.create(data);
    await loadData();
  };

  const handleUpdateProduct = async (data: CreateProductDto) => {
    if (selectedProduct) {
      await productsService.update(selectedProduct.id, data);
      await loadData();
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await productsService.delete(id);
      await loadData();
    }
  };

  const handleCreateCategory = async (data: CreateCategoryDto) => {
    await categoriesService.create(data);
    await loadData();
  };

  const handleUpdateCategory = async (data: CreateCategoryDto) => {
    if (selectedCategory) {
      await categoriesService.update(selectedCategory.id, data);
      await loadData();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      await categoriesService.delete(id);
      await loadData();
    }
  };

  const openProductModal = (product?: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(undefined);
    setIsProductModalOpen(false);
  };

  const openCategoryModal = (category?: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(undefined);
    setIsCategoryModalOpen(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center p-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'products'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Productos ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'categories'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Categorías ({categories.length})
              </button>
            </div>
            <button
              onClick={() => activeTab === 'products' ? openProductModal() : openCategoryModal()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              + Nuevo {activeTab === 'products' ? 'Producto' : 'Categoría'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'products' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Stock</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category?.name || '-'}</td>
                      <td className="py-3 px-4 text-right">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{product.stock}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openProductModal(product)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay productos registrados
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{category.name}</td>
                      <td className="py-3 px-4">{category.description || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openCategoryModal(category)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay categorías registradas
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        product={selectedProduct}
        categories={categories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
        category={selectedCategory}
      />
    </Layout>
  );
}
