export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-lg border border-gray-300">
        <div className="px-5 py-4 border-b border-gray-300 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-green-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">{children}</div>
        {footer && (
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-300 rounded-b-2xl flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
