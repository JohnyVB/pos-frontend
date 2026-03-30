import { Fragment } from "react";
import { Pagination } from "react-bootstrap";
import type { Product } from "../../interfaces/global.interface";

interface TablePaginationProps {
  data: Product[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  loadData: (page: number, limit?: number) => void;
}

export const TablePagination = ({ data, totalRecords, currentPage, totalPages, loadData }: TablePaginationProps) => {
  return (
    <div className="d-flex justify-content-center gap-3 align-items-center mt-3 p-3 shadow-sm rounded">
      <div className="text-muted small">
        Mostrando <strong>{data.length}</strong> de <strong>{totalRecords}</strong> productos
      </div>

      <Pagination size="sm" className="mb-0">
        {/* Ir a la primera */}
        <Pagination.First
          onClick={() => loadData(1)}
          disabled={currentPage === 1}
        />

        {/* Anterior */}
        <Pagination.Prev
          onClick={() => loadData(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {/* Números de página inteligentes */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            // Solo mostramos: la primera, la última, y las 2 alrededor de la actual
            return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
          })
          .map((page, index, array) => (
            <Fragment key={page}>
              {/* Añadir elipsis si hay saltos entre números */}
              {index > 0 && page !== array[index - 1] + 1 && <Pagination.Ellipsis disabled />}

              <Pagination.Item
                active={page === currentPage}
                onClick={() => loadData(page)}
              >
                {page}
              </Pagination.Item>
            </Fragment>
          ))}

        {/* Siguiente */}
        <Pagination.Next
          onClick={() => loadData(currentPage + 1)}
          disabled={currentPage === totalPages}
        />

        {/* Ir a la última */}
        <Pagination.Last
          onClick={() => loadData(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  )
}
