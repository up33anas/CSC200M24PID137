export default function StockView({ stock, viewModel }) {
  const handleClick = () => {
    viewModel.drawFromStock(); // call GameController
  };

  const cards = stock.getStockCards();
  const hasCards = cards.length > 0;

  return (
    <div
      className="w-30 h-45 border-2 border-gray-400 rounded-lg bg-green-800/60 
                 flex items-center justify-center cursor-pointer shadow-lg hover:bg-green-700 transition-colors"
      onClick={handleClick}
      title={hasCards ? "Draw from stock" : "Recycle waste pile"}
    >
      {hasCards ? "🂠" : "↩️"}
    </div>
  );
}
