// components/ResultTable.tsx
import React from "react";

type ResultTableProps = {
  tableData?: any[];
};

const ResultTable: React.FC<ResultTableProps> = ({ tableData }) => {

  // Kiểm tra dữ liệu đầu vào
  if (!tableData || !tableData || !tableData) return null;

  // Tạo ma trận 6 hàng x 12 cột
  const matrix: (number | null)[][] = Array.from({ length: 12 }, () =>
    Array.from({ length: 6 }, () => null)
  );

  // 👉 Lấy 30 phần tử mới nhất, sort tăng dần để showX/showY theo thứ tự thời gian
  const sorted = [...tableData].sort((a, b) => a.stampTime - b.stampTime);

  // 👉 Kiểm tra xem có phần tử nào showX >= 12 => reset bảng
  const isOverflow = sorted.some((item) => item.showX >= 12);

  // 👉 Nếu overflow, reset lại showX/showY
  const displayItems = isOverflow
    ? sorted.map((item, index) => ({
        ...item,
        showX: Math.floor(index / 6),
        showY: index % 6,
      }))
    : sorted;

  // 👉 Gán giá trị vào matrix

  displayItems.forEach((item: any, index: number) => {
    const col = Math.floor(index / 6); // cột (từ 0 đến 11)
    const row = index % 6; // hàng (từ 0 đến 5)
    matrix[col][row] = item.road;
  });

  // Hàm map road => ảnh tương ứng
  const getSymbolImage = (road: number) => {
    switch (road) {
      case 0:
        return "/assets/casino/symbol_b_small.png";
      case 1:
        return "/assets/casino/symbol_b_small.png";
      case 2:
        return "/assets/casino/symbol_b_small.png";

      case 8:
        return "/assets/casino/symbol_p_small.png";
      case 9:
        return "/assets/casino/symbol_p_small.png";
      case 10:
        return "/assets/casino/symbol_p_small.png";

      default:
        return "/assets/casino/symbol_t_small.png";
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="mx-auto border-separate border-spacing-1 w-full h-[250px]">
        <tbody>
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 12 }, (_, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-green-400 w-7 h-7 text-center align-middle"
                >
                  {matrix[colIndex][rowIndex] !== null && (
                    <img
                      src={getSymbolImage(matrix[colIndex][rowIndex]!)}
                      alt="result"
                      className="mx-auto w-5 h-5"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
