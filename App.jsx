import React, { useEffect, useMemo, useState } from "react";

const LOGO_SRC = "/jenos-logo.png"; // Reemplaza este archivo por el logo real de Jeno's Pizza en la carpeta public

const brand = {
  red: "#B31322",
  deepRed: "#7E0E18",
  yellow: "#FFC928",
  green: "#0C7C3A",
  cream: "#FFF4D8",
  dark: "#261313",
  white: "#FFFFFF",
};

const products = [
  {
    id: 1,
    name: "Pizza Gran Jeno's",
    description: "Pepperoni, queso fundido, salsa artesanal y borde crocante.",
    price: 34900,
    emoji: "🍕",
    tag: "Favorita",
  },
  {
    id: 2,
    name: "Criolla al Horno",
    description: "Maíz, tocineta, pollo, queso mozzarella y toque de la casa.",
    price: 38900,
    emoji: "🔥",
    tag: "Especial",
  },
  {
    id: 3,
    name: "Vegetariana Alegre",
    description: "Champiñones, pimentón, cebolla, tomate y extra queso.",
    price: 32900,
    emoji: "🥦",
    tag: "Ligera",
  },
  {
    id: 4,
    name: "Combo Rueda Feliz",
    description: "Pizza personal, bebida y pan de ajo para un pedido rápido.",
    price: 22900,
    emoji: "🥤",
    tag: "Combo",
  },
];

const processSteps = [
  {
    title: "Portal de la Masa",
    subtitle: "Tu orden entró oficialmente a la cocina Jeno's.",
    icon: "🧾",
  },
  {
    title: "Escuadrón Salsa Roja",
    subtitle: "La base recibe la salsa secreta y empieza la magia.",
    icon: "🍅",
  },
  {
    title: "Lluvia de Queso Dorado",
    subtitle: "El queso y los ingredientes caen en formación perfecta.",
    icon: "🧀",
  },
  {
    title: "Dragón del Horno",
    subtitle: "La pizza está tomando poder, aroma y crocancia.",
    icon: "🔥",
  },
  {
    title: "Corte Ninja",
    subtitle: "El equipo divide cada porción con precisión de maestro pizzero.",
    icon: "🥷",
  },
  {
    title: "Caja Voladora",
    subtitle: "Tu pedido se empaca y se prepara para entregar.",
    icon: "📦",
  },
  {
    title: "Campana de Victoria",
    subtitle: "Pedido listo. La misión pizza fue completada.",
    icon: "🏁",
  },
];

function currency(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function AppLogo() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="logoWrap">
      {!logoError && (
        <img
          src={LOGO_SRC}
          alt="Jeno's Pizza"
          className="logoImage"
          onError={() => setLogoError(true)}
        />
      )}
      {logoError && (
        <div className="logoFallback">
          <span>JENO'S</span>
          <small>PIZZA</small>
        </div>
      )}
    </div>
  );
}

function QuantityButton({ children, onClick, disabled }) {
  return (
    <button className="qtyBtn" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [customer, setCustomer] = useState({ name: "", phone: "", table: "" });
  const [cart, setCart] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Pago en caja");

  const cartItems = useMemo(() => {
    return products
      .map((product) => ({ ...product, quantity: cart[product.id] || 0 }))
      .filter((product) => product.quantity > 0);
  }, [cart]);

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const progress = Math.round(((activeStep + 1) / processSteps.length) * 100);
  const isOrderReady = activeStep === processSteps.length - 1;

  useEffect(() => {
    if (screen !== "tracking") return;
    if (activeStep >= processSteps.length - 1) return;

    const timer = setTimeout(() => {
      setActiveStep((step) => step + 1);
    }, 2400);

    return () => clearTimeout(timer);
  }, [screen, activeStep]);

  function updateQuantity(productId, type) {
    setCart((current) => {
      const quantity = current[productId] || 0;
      const nextQuantity = type === "add" ? quantity + 1 : Math.max(0, quantity - 1);
      return { ...current, [productId]: nextQuantity };
    });
  }

  function startOrder() {
    const safeName = customer.name.trim();
    if (!safeName) return;
    setScreen("menu");
  }

  function confirmOrder() {
    if (!cartItems.length) return;
    setOrderNumber(`JP-${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveStep(0);
    setScreen("tracking");
  }

  function resetPrototype() {
    setScreen("login");
    setCustomer({ name: "", phone: "", table: "" });
    setCart({});
    setActiveStep(0);
    setOrderNumber(null);
    setPaymentMethod("Pago en caja");
  }

  return (
    <main className="appShell">
      <section className="phoneFrame">
        <div className="topGlow" />

        {screen === "login" && (
          <section className="view loginView">
            <AppLogo />
            <div className="heroBadge">Prototipo funcional mobile</div>
            <h1>Bienvenido a la experiencia Jeno's Pizza</h1>
            <p className="lead">
              Ingresa tus datos, arma tu pedido y sigue la ruta creativa de la pizza hasta que esté lista.
            </p>

            <div className="formCard">
              <label>
                Nombre del cliente
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Ej: Juan Téllez"
                />
              </label>

              <label>
                Celular
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Ej: 300 000 0000"
                />
              </label>

              <label>
                Mesa o punto de entrega
                <input
                  value={customer.table}
                  onChange={(e) => setCustomer({ ...customer, table: e.target.value })}
                  placeholder="Ej: Mesa 8 / Recoger en caja"
                />
              </label>
            </div>

            <button className="primaryBtn" onClick={startOrder} disabled={!customer.name.trim()}>
              Ingresar al menú
            </button>
          </section>
        )}

        {screen === "menu" && (
          <section className="view menuView">
            <header className="compactHeader">
              <AppLogo />
              <div>
                <p>Hola, {customer.name.trim()}</p>
                <strong>Arma tu pedido</strong>
              </div>
            </header>

            <div className="promoCard">
              <span>🍕</span>
              <div>
                <strong>Ruta pizza activada</strong>
                <p>Elige tus productos y observa el avance en tiempo real.</p>
              </div>
            </div>

            <div className="productList">
              {products.map((product) => {
                const quantity = cart[product.id] || 0;
                return (
                  <article className="productCard" key={product.id}>
                    <div className="productEmoji">{product.emoji}</div>
                    <div className="productInfo">
                      <div className="productTitleRow">
                        <h3>{product.name}</h3>
                        <span>{product.tag}</span>
                      </div>
                      <p>{product.description}</p>
                      <strong>{currency(product.price)}</strong>
                    </div>
                    <div className="qtyControl">
                      <QuantityButton onClick={() => updateQuantity(product.id, "remove")} disabled={quantity === 0}>
                        −
                      </QuantityButton>
                      <b>{quantity}</b>
                      <QuantityButton onClick={() => updateQuantity(product.id, "add")}>+</QuantityButton>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="orderPanel">
              <div>
                <span>Total pedido</span>
                <strong>{currency(total)}</strong>
              </div>

              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option>Pago en caja</option>
                <option>Pago contraentrega</option>
                <option>Tarjeta / datáfono</option>
              </select>

              <button className="primaryBtn" onClick={confirmOrder} disabled={!cartItems.length}>
                Confirmar orden
              </button>
            </div>
          </section>
        )}

        {screen === "tracking" && (
          <section className="view trackingView">
            <header className="trackingHeader">
              <AppLogo />
              <div className="orderChip">Orden {orderNumber}</div>
            </header>

            <section className="statusHero">
              <div className="stepIcon">{processSteps[activeStep].icon}</div>
              <p>{isOrderReady ? "Pedido finalizado" : "Pedido en proceso"}</p>
              <h2>{processSteps[activeStep].title}</h2>
              <span>{processSteps[activeStep].subtitle}</span>

              <div className="progressTrack">
                <div style={{ width: `${progress}%` }} />
              </div>
              <small>{progress}% completado</small>
            </section>

            <section className="timeline">
              {processSteps.map((step, index) => {
                const state = index < activeStep ? "done" : index === activeStep ? "active" : "pending";
                return (
                  <article className={`timelineItem ${state}`} key={step.title}>
                    <div className="dot">{index < activeStep ? "✓" : step.icon}</div>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.subtitle}</p>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="summaryCard">
              <h3>Resumen del pedido</h3>
              {cartItems.map((item) => (
                <div className="summaryLine" key={item.id}>
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <strong>{currency(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="summaryLine totalLine">
                <span>{paymentMethod}</span>
                <strong>{currency(total)}</strong>
              </div>
            </section>

            {isOrderReady ? (
              <button className="primaryBtn finishBtn" onClick={resetPrototype}>
                Finalizar pedido y volver al inicio
              </button>
            ) : (
              <button className="secondaryBtn" onClick={() => setActiveStep((step) => Math.min(step + 1, processSteps.length - 1))}>
                Avanzar proceso manualmente
              </button>
            )}
          </section>
        )}
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at top, ${brand.yellow}55, transparent 26rem),
            linear-gradient(135deg, ${brand.deepRed}, ${brand.red});
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: ${brand.dark};
        }

        button,
        input,
        select {
          font: inherit;
        }

        .appShell {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 18px;
        }

        .phoneFrame {
          width: min(100%, 430px);
          min-height: 860px;
          max-height: 96vh;
          overflow-y: auto;
          position: relative;
          border-radius: 38px;
          padding: 22px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,244,216,0.98)),
            ${brand.cream};
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
          border: 8px solid rgba(255, 255, 255, 0.45);
        }

        .topGlow {
          position: absolute;
          inset: 0;
          height: 210px;
          pointer-events: none;
          border-radius: 30px 30px 60px 60px;
          background:
            radial-gradient(circle at 18% 10%, ${brand.yellow}AA, transparent 8rem),
            radial-gradient(circle at 88% 18%, ${brand.green}55, transparent 8rem);
          opacity: 0.95;
        }

        .view {
          position: relative;
          z-index: 1;
        }

        .loginView {
          min-height: 790px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
        }

        .logoWrap {
          width: 128px;
          height: 92px;
          border-radius: 26px;
          display: grid;
          place-items: center;
          background: ${brand.white};
          box-shadow: 0 18px 38px rgba(126, 14, 24, 0.18);
          border: 2px solid rgba(179, 19, 34, 0.08);
          overflow: hidden;
        }

        .logoImage {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
        }

        .logoFallback {
          display: grid;
          place-items: center;
          color: ${brand.red};
          font-weight: 1000;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .logoFallback small {
          color: ${brand.green};
          font-size: 0.72rem;
          letter-spacing: 0.24em;
          margin-left: 0.25em;
        }

        .heroBadge {
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          color: ${brand.deepRed};
          background: ${brand.yellow};
          font-weight: 800;
          font-size: 0.78rem;
          box-shadow: 0 10px 24px rgba(255, 201, 40, 0.38);
        }

        h1,
        h2,
        h3,
        p {
          margin: 0;
        }

        h1 {
          font-size: clamp(2rem, 8vw, 3.1rem);
          line-height: 0.94;
          letter-spacing: -0.08em;
          max-width: 12ch;
          color: ${brand.deepRed};
        }

        .lead {
          font-size: 1rem;
          line-height: 1.55;
          color: rgba(38, 19, 19, 0.72);
        }

        .formCard,
        .productCard,
        .orderPanel,
        .statusHero,
        .summaryCard,
        .promoCard {
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(179, 19, 34, 0.09);
          box-shadow: 0 18px 34px rgba(126, 14, 24, 0.12);
          backdrop-filter: blur(14px);
        }

        .formCard {
          display: grid;
          gap: 12px;
          padding: 16px;
          border-radius: 26px;
        }

        label {
          display: grid;
          gap: 7px;
          font-size: 0.78rem;
          font-weight: 800;
          color: ${brand.deepRed};
        }

        input,
        select {
          width: 100%;
          border: 0;
          outline: none;
          border-radius: 16px;
          background: ${brand.cream};
          padding: 14px 14px;
          color: ${brand.dark};
          border: 1px solid rgba(126, 14, 24, 0.08);
        }

        .primaryBtn,
        .secondaryBtn {
          width: 100%;
          border: 0;
          cursor: pointer;
          border-radius: 20px;
          min-height: 56px;
          font-weight: 1000;
          transition: transform 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
        }

        .primaryBtn {
          background: linear-gradient(135deg, ${brand.red}, ${brand.deepRed});
          color: ${brand.white};
          box-shadow: 0 16px 28px rgba(179, 19, 34, 0.32);
        }

        .secondaryBtn {
          background: ${brand.yellow};
          color: ${brand.deepRed};
          box-shadow: 0 14px 24px rgba(255, 201, 40, 0.28);
        }

        .primaryBtn:hover,
        .secondaryBtn:hover,
        .qtyBtn:hover {
          transform: translateY(-1px);
        }

        .primaryBtn:disabled,
        .qtyBtn:disabled {
          cursor: not-allowed;
          opacity: 0.48;
          transform: none;
          box-shadow: none;
        }

        .compactHeader,
        .trackingHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .compactHeader .logoWrap,
        .trackingHeader .logoWrap {
          width: 86px;
          height: 62px;
          border-radius: 20px;
          flex: 0 0 auto;
        }

        .compactHeader p {
          font-size: 0.82rem;
          color: rgba(38, 19, 19, 0.62);
          text-align: right;
        }

        .compactHeader strong {
          display: block;
          color: ${brand.deepRed};
          font-size: 1.45rem;
          letter-spacing: -0.06em;
          text-align: right;
        }

        .promoCard {
          display: flex;
          gap: 13px;
          align-items: center;
          border-radius: 26px;
          padding: 15px;
          margin-bottom: 18px;
          background: linear-gradient(135deg, ${brand.deepRed}, ${brand.red});
          color: ${brand.white};
        }

        .promoCard span {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: ${brand.yellow};
          font-size: 1.7rem;
        }

        .promoCard p {
          margin-top: 4px;
          color: rgba(255,255,255,0.78);
          font-size: 0.88rem;
        }

        .productList {
          display: grid;
          gap: 12px;
          padding-bottom: 180px;
        }

        .productCard {
          position: relative;
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 12px;
          border-radius: 26px;
          padding: 14px;
        }

        .productEmoji {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-size: 1.9rem;
          background: ${brand.cream};
        }

        .productInfo {
          padding-right: 78px;
        }

        .productTitleRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .productTitleRow h3 {
          font-size: 1rem;
          color: ${brand.deepRed};
          line-height: 1.12;
        }

        .productTitleRow span {
          flex: 0 0 auto;
          border-radius: 999px;
          padding: 5px 8px;
          font-size: 0.66rem;
          font-weight: 1000;
          color: ${brand.green};
          background: rgba(12, 124, 58, 0.1);
        }

        .productInfo p {
          margin: 7px 0 8px;
          line-height: 1.35;
          color: rgba(38, 19, 19, 0.63);
          font-size: 0.84rem;
        }

        .productInfo strong {
          color: ${brand.dark};
        }

        .qtyControl {
          position: absolute;
          right: 14px;
          bottom: 14px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: ${brand.cream};
          padding: 6px;
          border-radius: 999px;
        }

        .qtyBtn {
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 50%;
          background: ${brand.red};
          color: ${brand.white};
          font-weight: 1000;
          cursor: pointer;
        }

        .qtyControl b {
          min-width: 18px;
          text-align: center;
          color: ${brand.deepRed};
        }

        .orderPanel {
          position: sticky;
          bottom: 0;
          display: grid;
          gap: 12px;
          margin-top: -160px;
          border-radius: 28px;
          padding: 16px;
          border: 2px solid rgba(255, 201, 40, 0.55);
        }

        .orderPanel > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .orderPanel span {
          color: rgba(38, 19, 19, 0.66);
          font-weight: 800;
        }

        .orderPanel strong {
          color: ${brand.deepRed};
          font-size: 1.35rem;
          letter-spacing: -0.04em;
        }

        .orderChip {
          border-radius: 999px;
          padding: 10px 13px;
          background: ${brand.yellow};
          color: ${brand.deepRed};
          font-weight: 1000;
          box-shadow: 0 12px 24px rgba(255, 201, 40, 0.25);
        }

        .statusHero {
          border-radius: 34px;
          padding: 22px;
          text-align: center;
          background: linear-gradient(180deg, ${brand.white}, ${brand.cream});
        }

        .stepIcon {
          width: 88px;
          height: 88px;
          border-radius: 30px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          font-size: 3rem;
          background: ${brand.yellow};
          box-shadow: 0 20px 36px rgba(255, 201, 40, 0.28);
        }

        .statusHero p {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: ${brand.green};
          font-size: 0.72rem;
          font-weight: 1000;
        }

        .statusHero h2 {
          margin: 8px 0;
          color: ${brand.deepRed};
          font-size: 1.7rem;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .statusHero span {
          display: block;
          color: rgba(38, 19, 19, 0.68);
          line-height: 1.45;
        }

        .progressTrack {
          height: 12px;
          width: 100%;
          margin: 20px 0 8px;
          border-radius: 999px;
          background: rgba(126, 14, 24, 0.08);
          overflow: hidden;
        }

        .progressTrack div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, ${brand.green}, ${brand.yellow}, ${brand.red});
          transition: width 0.7s ease;
        }

        .statusHero small {
          font-weight: 900;
          color: ${brand.deepRed};
        }

        .timeline {
          display: grid;
          gap: 10px;
          margin: 16px 0;
        }

        .timelineItem {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.56);
          border: 1px solid rgba(126, 14, 24, 0.08);
          opacity: 0.72;
        }

        .timelineItem.active {
          opacity: 1;
          background: rgba(255, 201, 40, 0.22);
          border-color: rgba(255, 201, 40, 0.7);
        }

        .timelineItem.done {
          opacity: 1;
          background: rgba(12, 124, 58, 0.1);
          border-color: rgba(12, 124, 58, 0.18);
        }

        .dot {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: ${brand.white};
          font-size: 1.25rem;
          font-weight: 1000;
          color: ${brand.green};
        }

        .timelineItem h3 {
          font-size: 0.98rem;
          color: ${brand.deepRed};
        }

        .timelineItem p {
          margin-top: 4px;
          font-size: 0.8rem;
          line-height: 1.35;
          color: rgba(38, 19, 19, 0.62);
        }

        .summaryCard {
          display: grid;
          gap: 10px;
          border-radius: 26px;
          padding: 16px;
          margin-bottom: 14px;
        }

        .summaryCard h3 {
          color: ${brand.deepRed};
          margin-bottom: 2px;
        }

        .summaryLine {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.86rem;
          color: rgba(38, 19, 19, 0.7);
        }

        .summaryLine strong {
          color: ${brand.dark};
          white-space: nowrap;
        }

        .totalLine {
          border-top: 1px dashed rgba(126, 14, 24, 0.2);
          padding-top: 10px;
          font-weight: 1000;
        }

        .finishBtn {
          background: linear-gradient(135deg, ${brand.green}, #075527);
          box-shadow: 0 16px 28px rgba(12, 124, 58, 0.28);
        }

        @media (max-width: 460px) {
          .appShell {
            padding: 0;
            align-items: stretch;
          }

          .phoneFrame {
            width: 100%;
            min-height: 100vh;
            max-height: none;
            border: 0;
            border-radius: 0;
            padding: 18px;
          }

          .topGlow {
            border-radius: 0 0 44px 44px;
          }

          .loginView {
            min-height: calc(100vh - 36px);
          }
        }
      `}</style>
    </main>
  );
}
