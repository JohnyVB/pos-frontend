import { Table, Card, Badge } from "react-bootstrap";

export interface LowStockProduct {
  id: number;
  name: string;
  barcode: string;
  min_stock: number;
  current_stock: number;
  quantity_to_buy: number;
  category_name: string;
}

interface TabLowStockProps {
  products: LowStockProduct[];
}

const TabLowStock = ({ products }: TabLowStockProps) => {
  return (
    <div>
      <h3 className="mb-4">Productos con Bajo Stock</h3>
      <Card className="shadow-sm border-0 bg-white">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="py-3">Barcode</th>
                <th className="py-3">Categoría</th>
                <th className="text-center py-3">Stock Mínimo</th>
                <th className="text-center py-3">Stock Actual</th>
                <th className="text-center px-4 py-3">Cantidad a Comprar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 fw-semibold">{p.name}</td>
                  <td className="text-muted"><small className="font-monospace">{p.barcode}</small></td>
                  <td>
                    <Badge bg="light" text="dark" className="border shadow-sm px-2 py-1 text-wrap" style={{ maxWidth: '120px' }}>
                      {p.category_name || "N/A"}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Badge bg="secondary" className="px-2 py-1">{p.min_stock}</Badge>
                  </td>
                  <td className="text-center">
                    <Badge bg="danger" className="px-2 py-1">{p.current_stock}</Badge>
                  </td>
                  <td className="text-center px-4">
                    <Badge bg="warning" text="dark" className="px-2 py-1">{p.quantity_to_buy}</Badge>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">
                    No hay productos con bajo stock.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabLowStock;
