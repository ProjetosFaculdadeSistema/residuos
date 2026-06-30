function ErrorMessage({ mensagem, onTentar }) {
  if (!mensagem) return null

  return (
    <div role="alert" className="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <span>{mensagem}</span>
      {onTentar && (
        <button onClick={onTentar} className="btn btn-sm btn-ghost">
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
