export default function Watermark() {
  // 生成多行水印文字
  const generateWatermarks = () => {
    const watermarks = [];
    const rows = 15;
    const cols = 8;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        watermarks.push(
          <span key={`${i}-${j}`} className="watermark-text">
            非星商行
          </span>
        );
      }
    }
    return watermarks;
  };

  return (
    <div className="watermark-container">
      <div className="watermark-content">
        {generateWatermarks()}
      </div>
    </div>
  );
}
