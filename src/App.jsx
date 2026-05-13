import { useEffect, useMemo, useState } from "react";

const LOGO_SRC = "/jenos-logo.png";

const products = [
  {
    id: 1,
    name: "Pizza Gran Jeno's",
    description: "Pepperoni, salsa de la casa, queso fundido y borde crocante.",
    price: 34900,
    emoji: "🍕",
    tag: "Favorita"
  },
  {
    id: 2,
    name: "Criolla al Horno",
    description: "Pollo, maíz, tocineta, mozzarella y toque especial Jeno's.",
    price: 38900,
    emoji: "🔥",
    tag: "Especial"
  },
  {
    id: 3,
    name: "Vegetariana Alegre",
    description: "Champiñones, pimentón, cebolla, tomate, aceitunas y extra queso.",
    price: 32900,
    emoji: "🥦",
    tag: "Ligera"
  },
  {
    id: 4,
    name: "Combo Rueda Feliz",
    description: "Pizza personal, bebida y pan de ajo para una orden rápida.",
    price: 22900,
    emoji: "🥤",
    tag: "Combo"
  }
];

const timeline = [
  {
    title: "Portal de la Masa",
    subtitle: "La orden entró oficialmente a la cocina Jeno's.",
    icon: "🧾"
  },
  {
    title: "Escuadrón Salsa Roja",
    subtitle: "La base recibe la salsa y empieza la misión pizzera.",
    icon: "🍅"
  },
  {
    title: "Lluvia de Queso Dorado",
    subtitle: "El queso y los ingredientes caen en formación perfecta.",
    icon: "🧀"
  },
  {
    title: "Dragón del Horno",
    subtitle: "La pizza toma aroma, temperatura y crocancia.",
    icon: "🔥"
  },
  {
    title: "Corte Ninja",
    subtitle: "Cada porción se divide con precisión de maestro pizzero.",
    icon: "🥷"
  },
  {
    title: "Caja Voladora",
    subtitle: "El pedido se empaca y queda listo para entregar.",
    icon: "📦"
  },
  {
    title: "Campana de Victoria",
    subtitle: "Pedido listo. La misión pizza fue completada.",
    icon: "🏁"
  }
];

function formatCurrency(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
}

function Logo() {
  const [hasLogoError, setHasLogoError] = useState(false);

  return (
    <div className="logo-box">
      {!hasLogoError && (
        <img
          src={LOGO_SRC}
          alt="Jeno's Pizza"
          className="logo-img"
          onError={() => setHasLogoError(true)}
        />
      )}

      {hasLogoError && (
        <div className="logo-fallback">
          <span>JENO'S</span>
          <small>PIZZA</small>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [customer, setCustomer] = useState({ name: "", phone: "", deliveryPoint: "" });
  const [cart, setCart] = useState({});
  const [payment, setPayment] = useState("Pago en caja");
  const [orderNumber, setOrderNumber] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const cartItems = useMemo(() => {
    return products
      .map((product) => ({ ...product, quantity: cart[product.id] || 0 }))
      .filter((product) => product.quantity > 0);
  }, [cart]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const progress = Math.round(((activeStep + 1) / timeline.length) * 100);
  const isReady = activeStep === timeline.length - 1;

  useEffect(() => {
    if (screen !== "tracking") return;
    if (activeStep >= timeline.length - 1) return;

    const timer = setTimeout(() => {
      setActiveStep((current) => current + 1);
    }, 2300);

    return () => clearTimeout(timer);
  }, [screen, activeStep]);

  function changeQuantity(productId, action) {
    setCart((currentCart) => {
      const currentQuantity = currentCart[productId] || 0;
      const nextQuantity = action === "add" ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);

      return {
        ...currentCart,
        [productId]: nextQuantity
      };
    });
  }

  function goToMenu() {
    if (!customer.name.trim()) return;
    setScreen("menu");
  }

  function confirmOrder() {
    if (cartItems.length === 0) return;
    setOrderNumber(`JP-${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveStep(0);
    setScreen("tracking");
  }

  function finishOrder() {
    setScreen("login");
    setCustomer({ name: "", phone: "", deliveryPoint: "" });
    setCart({});
    setPayment("Pago en caja");
    setOrderNumber("");
    setActiveStep(0);
  }

  return (
    <main className="app-background">
      <section className="mobile-shell">
        <div className="decor decor-one" />
        <div className="decor decor-two" />

        {screen === "login" && (
          <section className="screen login-screen">
            <Logo />
            <div className="badge">Prototipo funcional</div>
            <h1>Bienvenido a Jeno's Pizza</h1>
            <p className="intro">
              Ingresa tus datos, arma tu pedido y sigue en vivo la ruta creativa de tu pizza hasta que esté lista.
            </p>

            <div className="card form-card">
              <label>
                Nombre del cliente
                <input
                  value={customer.name}
                  onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                  placeholder="Ej: Juan Téllez"
                />
              </label>

              <label>
                Celular
                <input
                  value={customer.phone}
                  onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                  placeholder="Ej: 300 000 0000"
                />
              </label>

              <label>
                Mesa o punto de entrega
                <input
                  value={customer.deliveryPoint}
                  onChange={(event) => setCustomer({ ...customer, deliveryPoint: event.target.value })}
                  placeholder="Ej: Mesa 8 / Recoger en caja"
                />
              </label>
            </div>

            <button className="primary-button" onClick={goToMenu} disabled={!customer.name.trim()}>
              Ingresar al menú
            </button>
          </section>
        )}

        {screen === "menu" && (
          <section className="screen menu-screen">
            <header className="topbar">
              <Logo />
              <div>
                <span>Hola, {customer.name}</span>
                <strong>Arma tu pedido</strong>
              </div>
            </header>

            <div className="promo-card">
              <div className="promo-icon">🍕</div>
              <div>
                <strong>Ruta pizza activada</strong>
                <p>Selecciona tus productos y confirma la orden.</p>
              </div>
            </div>

            <section className="product-list">
              {products.map((product) => {
                const quantity = cart[product.id] || 0;

                return (
                  <article className="card product-card" key={product.id}>
                    <div className="product-emoji">{product.emoji}</div>

                    <div className="product-info">
                      <div className="product-title-row">
                        <h3>{product.name}</h3>
                        <span>{product.tag}</span>
                      </div>
                      <p>{product.description}</p>
                      <strong>{formatCurrency(product.price)}</strong>
                    </div>

                    <div className="quantity-control">
                      <button onClick={() => changeQuantity(product.id, "remove")} disabled={quantity === 0}>
                        −
                      </button>
                      <b>{quantity}</b>
                      <button onClick={() => changeQuantity(product.id, "add")}>+</button>
                    </div>
                  </article>
                );
              })}
            </section>

            <footer className="order-footer card">
              <div className="total-row">
                <span>Total pedido</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <select value={payment} onChange={(event) => setPayment(event.target.value)}>
                <option>Pago en caja</option>
                <option>Pago contraentrega</option>
                <option>Tarjeta / datáfono</option>
              </select>

              <button className="primary-button" onClick={confirmOrder} disabled={cartItems.length === 0}>
                Confirmar orden
              </button>
            </footer>
          </section>
        )}

        {screen === "tracking" && (
          <section className="screen tracking-screen">
            <header className="topbar tracking-topbar">
              <Logo />
              <div className="order-chip">Orden {orderNumber}</div>
            </header>

            <section className="status-card card">
              <div className="current-icon">{timeline[activeStep].icon}</div>
              <span className="status-label">{isReady ? "Pedido finalizado" : "Pedido en proceso"}</span>
              <h2>{timeline[activeStep].title}</h2>
              <p>{timeline[activeStep].subtitle}</p>

              <div className="progress-track">
                <div style={{ width: `${progress}%` }} />
              </div>
              <small>{progress}% completado</small>
            </section>

            <section className="timeline-list">
              {timeline.map((step, index) => {
                let state = "pending";
                if (index < activeStep) state = "done";
                if (index === activeStep) state = "active";

                return (
                  <article className={`timeline-item ${state}`} key={step.title}>
                    <div className="timeline-dot">{index < activeStep ? "✓" : step.icon}</div>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.subtitle}</p>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="card summary-card">
              <h3>Resumen del pedido</h3>

              {cartItems.map((item) => (
                <div className="summary-line" key={item.id}>
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}

              <div className="summary-line total-summary">
                <span>{payment}</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </section>

            {isReady ? (
              <button className="primary-button finish-button" onClick={finishOrder}>
                Finalizar pedido y volver al inicio
              </button>
            ) : (
              <button
                className="secondary-button"
                onClick={() => setActiveStep((current) => Math.min(current + 1, timeline.length - 1))}
              >
                Avanzar proceso manualmente
              </button>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
