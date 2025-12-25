import ProductList from "./components/ProductList";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🛒 DummyJSON Product App</h1>
        <p>Product management demo using API integration</p>
      </header>

      <main className="container">
        <ProductList />
      </main>
    </div>
  );
}
