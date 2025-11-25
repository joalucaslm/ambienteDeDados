import Link from "next/link";

export default function Home() {
  const pages = [
    "Cliente",
    "Entregador",
    "HorarioFuncionamento",
    "Item",
    "Pagamento",
    "Pedido",
    "PedidoItem",
    "Restaurante",
    "TipoCozinha",
    "TipoItem",
    "Dashboard"
  ];

  return (
    <article style={styles.container}>
      <h1 style={styles.title}>Navegação</h1>

      <div style={styles.grid}>
        {pages.map((page) => (
          <Link key={page} href={`/${page}`}>
            <button style={styles.button}>{page}</button>
          </Link>
        ))}
      </div>
    </article>
  );
}

const styles = {
  container: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1rem",
    width: "100%",
    maxWidth: "700px",
  },
  button: {
    padding: "1rem",
    width: "100%",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f3f3f3",
    transition: "0.2s",
  }
};
